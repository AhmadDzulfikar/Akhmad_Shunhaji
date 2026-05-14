export const MANAGED_UPLOAD_PREFIX = "/api/uploads/blog/";
export const LEGACY_UPLOAD_PREFIX = "/uploads/blog/";

const TRUSTED_EXTERNAL_IMAGE_HOSTS = new Set(["cdn.sanity.io"]);
const IMAGE_EXTENSIONS = new Set([".webp", ".jpg", ".jpeg", ".png", ".gif"]);

type StoredImageUrlOptions = {
  allowEmpty?: boolean;
};

function hasSafeImageExtension(pathname: string) {
  const dotIndex = pathname.lastIndexOf(".");
  if (dotIndex < 0) {
    return false;
  }

  return IMAGE_EXTENSIONS.has(pathname.slice(dotIndex).toLowerCase());
}

function isSafeLocalPath(value: string) {
  let decodedValue = value;

  try {
    decodedValue = decodeURIComponent(value);
  } catch {
    return false;
  }

  return (
    decodedValue.startsWith("/") &&
    !decodedValue.includes("..") &&
    !decodedValue.includes("\\") &&
    hasSafeImageExtension(decodedValue)
  );
}

export function isManagedUploadUrl(value: string) {
  const trimmedValue = value.trim();

  return trimmedValue.startsWith(MANAGED_UPLOAD_PREFIX) && isSafeLocalPath(trimmedValue);
}

export function isAllowedStoredImageUrl(value: string | null | undefined, options: StoredImageUrlOptions = {}) {
  const { allowEmpty = true } = options;
  const trimmedValue = (value || "").trim();

  if (!trimmedValue) {
    return allowEmpty;
  }

  if (
    (trimmedValue.startsWith(MANAGED_UPLOAD_PREFIX) || trimmedValue.startsWith(LEGACY_UPLOAD_PREFIX)) &&
    isSafeLocalPath(trimmedValue)
  ) {
    return true;
  }

  try {
    const url = new URL(trimmedValue);
    return url.protocol === "https:" && TRUSTED_EXTERNAL_IMAGE_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function getManagedUploadPath(value: string | null | undefined) {
  const trimmedValue = (value || "").trim();

  if (!isManagedUploadUrl(trimmedValue)) {
    return null;
  }

  return trimmedValue.slice("/api/uploads/".length);
}

export function extractImageUrlsFromHtml(html: string) {
  const urls = new Set<string>();
  const imageTagPattern = /<img\b[^>]*\bsrc=(["'])(.*?)\1[^>]*>/gi;

  for (const match of html.matchAll(imageTagPattern)) {
    const src = match[2]?.trim();
    if (src) {
      urls.add(src);
    }
  }

  return [...urls];
}
