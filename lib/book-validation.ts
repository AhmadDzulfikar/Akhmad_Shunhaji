import { z } from "zod";

import { INITIAL_BOOK_IMAGE_URLS } from "@/lib/initial-books";
import { isAllowedStoredImageUrl } from "@/lib/image-policy";

type BookPayloadSchemaOptions = {
  currentImageUrl?: string | null;
};

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isAllowedBookImageUrl(
  value: string,
  currentImageUrl?: string | null,
) {
  if (isAllowedStoredImageUrl(value, { allowEmpty: false })) {
    return true;
  }

  return (
    Boolean(currentImageUrl) &&
    value === currentImageUrl &&
    INITIAL_BOOK_IMAGE_URLS.has(value)
  );
}

export function createBookPayloadSchema(
  options: BookPayloadSchemaOptions = {},
) {
  return z.object({
    title: z.string().trim().min(1, "Title wajib diisi").max(180),
    description: z
      .string()
      .trim()
      .min(1, "Description wajib diisi")
      .max(20_000),
    imageUrl: z
      .string()
      .trim()
      .min(1, "Image wajib diisi")
      .refine(
        (value) => isAllowedBookImageUrl(value, options.currentImageUrl),
        { message: "Image must be uploaded through the image uploader" },
      ),
    buyUrl: z
      .string()
      .trim()
      .min(1, "Buy link wajib diisi")
      .max(2_048)
      .refine(isHttpUrl, "Buy link harus URL http atau https"),
  });
}
