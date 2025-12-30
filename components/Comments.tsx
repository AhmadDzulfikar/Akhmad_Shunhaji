"use client";

import React, { useState, useEffect, useCallback } from "react";
import { MessageCircle, Reply, Loader2, ChevronDown, ChevronUp } from "lucide-react";

// Comment node type (matches API response)
interface CommentNode {
  id: number;
  name: string;
  content: string;
  createdAt: string;
  parentId: number | null;
  replies: CommentNode[];
}

interface CommentsProps {
  slug: string;
}

// Max indentation depth for display
const MAX_DISPLAY_DEPTH = 4;
const INDENT_PX = 24;

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Comment Form Component
function CommentForm({
  onSubmit,
  onCancel,
  loading,
  isReply = false,
}: {
  onSubmit: (name: string, email: string, content: string) => Promise<void>;
  onCancel?: () => void;
  loading: boolean;
  isReply?: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (!content.trim() || content.length < 3) {
      setError("Comment must be at least 3 characters");
      return;
    }

    try {
      await onSubmit(name.trim(), email.trim(), content.trim());
      // Clear form on success
      setName("");
      setEmail("");
      setContent("");
    } catch (e: any) {
      setError(e?.message || "Failed to post comment");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          placeholder="Write your comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 h-28 rounded bg-[#262727] border border-[#3a3a3a] text-[#f5f1e8] placeholder-[#808080] focus:border-[#4a9d6f] focus:outline-none resize-none"
          disabled={loading}
          maxLength={2000}
        />
        <div className="text-right text-xs text-[#808080] mt-1">
          {content.length}/2000
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-[#b8b8b8] mb-1">
            Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded bg-[#262727] border border-[#3a3a3a] text-[#f5f1e8] placeholder-[#808080] focus:border-[#4a9d6f] focus:outline-none"
            disabled={loading}
            maxLength={60}
          />
        </div>
        <div>
          <label className="block text-sm text-[#b8b8b8] mb-1">
            Email <span className="text-red-400">*</span>{" "}
            <span className="text-xs">(not displayed)</span>
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-[#262727] border border-[#3a3a3a] text-[#f5f1e8] placeholder-[#808080] focus:border-[#4a9d6f] focus:outline-none"
            disabled={loading}
          />
        </div>
      </div>

      {/* Honeypot field (hidden) */}
      <input
        type="text"
        name="honeypot"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded bg-[#4a9d6f] text-[#1a1a1a] font-medium disabled:opacity-50 hover:bg-[#3d8a5f] transition flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isReply ? "Reply" : "Post Comment"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded bg-[#262727] text-[#f5f1e8] hover:bg-[#3a3a3a] transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// Single Comment Component
function CommentItem({
  comment,
  depth,
  onReply,
  replyingToId,
  onSubmitReply,
  onCancelReply,
  replyLoading,
}: {
  comment: CommentNode;
  depth: number;
  onReply: (id: number) => void;
  replyingToId: number | null;
  onSubmitReply: (name: string, email: string, content: string) => Promise<void>;
  onCancelReply: () => void;
  replyLoading: boolean;
}) {
  const [showReplies, setShowReplies] = useState(true);
  const actualDepth = Math.min(depth, MAX_DISPLAY_DEPTH - 1);
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div
      className="relative"
      style={{
        marginLeft: depth > 0 ? INDENT_PX : 0,
      }}
    >
      {/* Thread line for nested comments */}
      {depth > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 w-px bg-[#3a3a3a]"
          style={{ left: -INDENT_PX / 2 }}
        />
      )}

      <div
        className={`py-4 ${
          depth > 0 ? "pl-4 border-l-2 border-[#3a3a3a]" : ""
        }`}
      >
        {/* Comment Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#4a9d6f] flex items-center justify-center text-sm font-bold text-[#1a1a1a]">
            {comment.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium text-[#f5f1e8]">{comment.name}</span>
          <span className="text-sm text-[#808080]">
            {formatDate(comment.createdAt)}
          </span>
        </div>

        {/* Comment Content */}
        <div
          className="text-[#d0d0d0] whitespace-pre-wrap break-words ml-10"
          style={{ wordBreak: "break-word" }}
        >
          {comment.content}
        </div>

        {/* Reply Button */}
        <div className="ml-10 mt-2 flex items-center gap-4">
          <button
            onClick={() => onReply(comment.id)}
            className="flex items-center gap-1 text-sm text-[#808080] hover:text-[#4a9d6f] transition"
          >
            <Reply className="w-4 h-4" />
            Reply
          </button>

          {hasReplies && (
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1 text-sm text-[#808080] hover:text-[#f5f1e8] transition"
            >
              {showReplies ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide replies ({comment.replies.length})
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show replies ({comment.replies.length})
                </>
              )}
            </button>
          )}
        </div>

        {/* Reply Form */}
        {replyingToId === comment.id && (
          <div className="ml-10 mt-4 p-4 bg-[#1f1f1f] rounded-lg border border-[#3a3a3a]">
            <p className="text-sm text-[#b8b8b8] mb-3">
              Replying to <span className="text-[#4a9d6f]">{comment.name}</span>
            </p>
            <CommentForm
              onSubmit={onSubmitReply}
              onCancel={onCancelReply}
              loading={replyLoading}
              isReply
            />
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {hasReplies && showReplies && (
        <div className="space-y-0">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onReply={onReply}
              replyingToId={replyingToId}
              onSubmitReply={onSubmitReply}
              onCancelReply={onCancelReply}
              replyLoading={replyLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Main Comments Component
export default function Comments({ slug }: CommentsProps) {
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyLoading, setReplyLoading] = useState(false);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${slug}/comments`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load comments");
      }

      setComments(data.items || []);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Submit new top-level comment
  const handleSubmitComment = useCallback(
    async (name: string, email: string, content: string) => {
      setSubmitting(true);
      try {
        const res = await fetch(`/api/posts/${slug}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, content }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 429) {
            throw new Error(
              `Too many comments. Please wait ${data.retryAfter || 60} seconds.`
            );
          }
          const msg =
            data.error === "validation"
              ? Object.values(data.issues?.fieldErrors || {})
                  .flat()
                  .join(", ") || "Validation failed"
              : data.error || "Failed to post comment";
          throw new Error(msg);
        }

        // Add new comment to list
        if (data.comment) {
          setComments((prev) => [...prev, data.comment]);
        }
      } finally {
        setSubmitting(false);
      }
    },
    [slug]
  );

  // Submit reply
  const handleSubmitReply = useCallback(
    async (name: string, email: string, content: string) => {
      if (!replyingToId) return;

      setReplyLoading(true);
      try {
        const res = await fetch(`/api/posts/${slug}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            content,
            parentId: replyingToId,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          if (res.status === 429) {
            throw new Error(
              `Too many comments. Please wait ${data.retryAfter || 60} seconds.`
            );
          }
          const msg =
            data.error === "validation"
              ? Object.values(data.issues?.fieldErrors || {})
                  .flat()
                  .join(", ") || "Validation failed"
              : data.error || "Failed to post reply";
          throw new Error(msg);
        }

        // Refetch to get updated tree
        await fetchComments();
        setReplyingToId(null);
      } finally {
        setReplyLoading(false);
      }
    },
    [slug, replyingToId, fetchComments]
  );

  const totalComments = comments.reduce((acc, c) => {
    const countReplies = (node: CommentNode): number => {
      let count = 1;
      for (const reply of node.replies) {
        count += countReplies(reply);
      }
      return count;
    };
    return acc + countReplies(c);
  }, 0);

  return (
    <div className="mt-16">
      {/* Section Header */}
      <div className="border-b border-[#3a3a3a] pb-4 mb-8">
        <h2 className="text-2xl font-bold text-[#f5f1e8] flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          Comments ({totalComments})
        </h2>
      </div>

      {/* Comment Form */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-[#f5f1e8] mb-1">
          Leave a Reply
        </h3>
        <div className="h-px bg-[#3a3a3a] w-24 mb-3" />
        <p className="text-sm text-[#808080] mb-4">
          Your email address will not be published. Required fields are marked{" "}
          <span className="text-red-400">*</span>
        </p>
        <CommentForm onSubmit={handleSubmitComment} loading={submitting} />
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#4a9d6f]" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchComments}
            className="mt-2 text-[#4a9d6f] hover:underline"
          >
            Try again
          </button>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-[#808080]">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              depth={0}
              onReply={setReplyingToId}
              replyingToId={replyingToId}
              onSubmitReply={handleSubmitReply}
              onCancelReply={() => setReplyingToId(null)}
              replyLoading={replyLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
