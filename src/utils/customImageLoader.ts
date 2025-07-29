// Custom image loader that handles external URLs through our proxy
export default function customImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // For local images (starting with /), use default Next.js behavior
  if (src.startsWith("/")) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
  }

  // For external URLs, use our custom proxy
  if (src.startsWith("http://") || src.startsWith("https://")) {
    const params = new URLSearchParams();
    params.set("url", src);
    params.set("w", width.toString());
    if (quality) {
      params.set("q", quality.toString());
    }
    return `/api/image-proxy?${params.toString()}`;
  }

  // Fallback to original src
  return src;
}
