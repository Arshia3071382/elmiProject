

export function extractAparatEmbedUrl(input: string): string {
  if (!input) return "";
  
  const trimmedInput = input.trim();

  if (trimmedInput.includes("<iframe") || trimmedInput.includes("<div")) {
    const iframeSrcMatch = trimmedInput.match(/<iframe[^>]*\bsrc=["']([^"']+)["']/i);
    if (iframeSrcMatch && iframeSrcMatch[1]) {
      return iframeSrcMatch[1].trim();
    }
  }

  if (trimmedInput.includes("aparat.com/video/video/embed")) {
    return trimmedInput;
  }

  const regularLinkMatch = trimmedInput.match(/aparat\.com\/v\/([a-zA-Z0-9]+)/i);
  if (regularLinkMatch && regularLinkMatch[1]) {
    const videoHash = regularLinkMatch[1];
    return `https://www.aparat.com/video/video/embed/videohash/${videoHash}/vt/frame`;
  }

  if (trimmedInput.startsWith("http") && trimmedInput.includes("aparat.com")) {
    return trimmedInput;
  }

  return "";
}