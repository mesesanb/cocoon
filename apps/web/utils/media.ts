// returns video url when provided, otherwise image url for the given path
export function resolveMedia(
  imagePath: string,
  videoUrl?: string | null
): { src: string; type: "video" | "image" } {
  if (videoUrl?.trim()) {
    return { src: videoUrl.startsWith("/") ? videoUrl : `/videos/${videoUrl}`, type: "video" };
  }
  return {
    src: buildImageUrl(imagePath),
    type: "image",
  };
}

export function buildImageUrl(path: string): string {
  if (path.startsWith("/")) return path;
  return `/images/${path}`;
}
