import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { checkRateLimit, getClientIP, COMMENT_RATE_LIMIT } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Validation schema
const createCommentSchema = z.object({
  name: z.string().min(2, "Name min 2 chars").max(60, "Name max 60 chars"),
  email: z.string().email("Invalid email"),
  content: z.string().min(3, "Comment min 3 chars").max(2000, "Comment max 2000 chars"),
  honeypot: z.string().max(0, "Bot detected").optional(),
  parentId: z.number().int().positive().optional(),
});

// Type for nested comments
interface CommentNode {
  id: number;
  name: string;
  content: string;
  createdAt: string;
  parentId: number | null;
  replies: CommentNode[];
}

// Max depth for nested comments
const MAX_DEPTH = 4;

/**
 * Build nested comment tree from flat list
 */
function buildCommentTree(
  comments: Array<{
    id: number;
    name: string;
    content: string;
    createdAt: Date;
    parentId: number | null;
  }>
): CommentNode[] {
  const map = new Map<number, CommentNode>();
  const roots: CommentNode[] = [];

  // Create nodes
  for (const c of comments) {
    map.set(c.id, {
      id: c.id,
      name: c.name,
      content: c.content,
      createdAt: c.createdAt.toISOString(),
      parentId: c.parentId,
      replies: [],
    });
  }

  // Build tree
  for (const node of map.values()) {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  // Sort by createdAt (asc)
  const sortByDate = (a: CommentNode, b: CommentNode) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

  function sortReplies(nodes: CommentNode[]) {
    nodes.sort(sortByDate);
    for (const node of nodes) {
      sortReplies(node.replies);
    }
  }

  sortReplies(roots);

  return roots;
}

/**
 * GET /api/posts/[slug]/comments
 * Return nested comment tree for a post
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Find post by slug
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: "post not found" }, { status: 404 });
    }

    // Get all comments for this post
    const comments = await prisma.comment.findMany({
      where: { postId: post.id },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
        parentId: true,
      },
      orderBy: { createdAt: "asc" },
    });

    // Build tree
    const tree = buildCommentTree(comments);

    return NextResponse.json({ items: tree, total: comments.length });
  } catch (error: any) {
    console.error("Get comments error:", error);
    return NextResponse.json(
      { error: "failed to get comments" },
      { status: 500 }
    );
  }
}

/**
 * Calculate depth of a comment
 */
async function getCommentDepth(commentId: number): Promise<number> {
  let depth = 0;
  let currentId: number | null = commentId;

  while (currentId) {
    const foundComment: { parentId: number | null } | null = await prisma.comment.findUnique({
      where: { id: currentId },
      select: { parentId: true },
    });
    if (!foundComment || !foundComment.parentId) break;
    depth++;
    currentId = foundComment.parentId;
  }

  return depth;
}

/**
 * POST /api/posts/[slug]/comments
 * Create a new comment (top-level or reply)
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Rate limiting
    const ip = getClientIP(req);
    const rateLimitResult = checkRateLimit(ip, COMMENT_RATE_LIMIT);

    if (!rateLimitResult.allowed) {
      const retryAfter = Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000);
      return NextResponse.json(
        { error: "rate limit exceeded", retryAfter },
        { 
          status: 429,
          headers: { "Retry-After": retryAfter.toString() }
        }
      );
    }

    // Find post by slug
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: "post not found" }, { status: 404 });
    }

    // Parse and validate body
    const body = await req.json().catch(() => ({}));
    const parsed = createCommentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, content, parentId } = parsed.data;

    // If parentId, validate it exists and check depth
    let actualParentId: number | null = null;
    if (parentId) {
      const parentComment = await prisma.comment.findFirst({
        where: { id: parentId, postId: post.id },
        select: { id: true },
      });

      if (!parentComment) {
        return NextResponse.json(
          { error: "parent comment not found" },
          { status: 400 }
        );
      }

      // Check depth - if too deep, attach to max depth parent
      const depth = await getCommentDepth(parentId);
      if (depth >= MAX_DEPTH - 1) {
        // Find the ancestor at max depth - 1
        let currentId: number | null = parentId;
        for (let i = depth; i >= MAX_DEPTH - 1 && currentId; i--) {
          const ancestorComment: { parentId: number | null } | null = await prisma.comment.findUnique({
            where: { id: currentId },
            select: { parentId: true },
          });
          if (ancestorComment?.parentId) {
            currentId = ancestorComment.parentId;
          }
        }
        actualParentId = currentId;
      } else {
        actualParentId = parentId;
      }
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        postId: post.id,
        parentId: actualParentId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        content: content.trim(),
      },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
        parentId: true,
      },
    });

    return NextResponse.json({
      ok: true,
      comment: {
        id: comment.id,
        name: comment.name,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        parentId: comment.parentId,
        replies: [],
      },
    });
  } catch (error: any) {
    console.error("Create comment error:", error);
    return NextResponse.json(
      { error: "failed to create comment" },
      { status: 500 }
    );
  }
}
