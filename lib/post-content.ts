import sanitizeHtml from "sanitize-html";

import { isAllowedStoredImageUrl } from "./image-policy.ts";

export const POST_EXCERPT_LENGTH = 180;

const POST_HTML_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "blockquote",
    "a",
    "span",
    "img",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "width", "height", "class", "loading", "decoding", "referrerpolicy"],
    "*": ["style"],
  },
  allowedStyles: {
    "*": {
      "text-align": [/^(left|right|center|justify)$/],
      "font-size": [/^\d+(\.\d+)?(px|em|rem|%)$/],
      "font-family": [/^[\w\s"',-]+$/],
    },
  },
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer",
      target: "_blank",
    }),
    img: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        alt: attribs.alt || "",
        class: attribs.class || "max-w-full h-auto rounded-lg my-4",
        decoding: "async",
        loading: "lazy",
        referrerpolicy: "no-referrer",
      },
    }),
  },
  exclusiveFilter(frame) {
    return frame.tag === "img" && !isAllowedStoredImageUrl(frame.attribs.src, { allowEmpty: false });
  },
};

export function sanitizePostContent(input: string) {
  return sanitizeHtml(input, POST_HTML_SANITIZE_OPTIONS);
}

function decodeExcerptEntities(input: string) {
  return input
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&hellip;/gi, "...")
    .replace(/&ndash;/gi, "-")
    .replace(/&mdash;/gi, "-");
}

export function createPostExcerpt(input: string, maxLength = POST_EXCERPT_LENGTH) {
  const text = decodeExcerptEntities(
    input
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();

  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 3).trim()}...`;
}

export function preparePostContentForDisplay(input: string) {
  return sanitizePostContent(input);
}
