import { NextRequest } from "next/server";

/**
 * Formats an image URL, handling numeric IDs or relative paths from the backend.
 * @param url - The image URL or ID from the backend
 * @returns A full URL string or a fallback placeholder
 */
export function formatImageUrl(url: string | null | undefined): string {
  if (!url) return "/images/avatar.png";

  // If it's already a full URL, return it
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }

  // If it's a numeric ID (common in some backends), or a relative path without leading slash
  // We prepend the backend's public base URL
  // For this project, we target the admin domain's public assets
  const baseUrl = "https://likeadmin.techdynobdltd.com";

  if (/^\d+$/.test(url)) {
    // If it's just a number, it might be an asset ID. 
    // Usually these backends have a specific route for images by ID, or we need to prepend a path.
    // Based on the 404 error /179, it's being used as a path.
    return `${baseUrl}/${url}`;
  }

  // Handle absolute paths from root
  if (url.startsWith("/")) {
    return `${baseUrl}${url}`;
  }

  // Default case: prepend base URL
  return `${baseUrl}/${url}`;
}

/**
 * Extracts the Bearer token from the Authorization header of a Next.js request
 * @param request - Next.js request object
 * @returns The Bearer token string, or null if not found
 */
export function getBearerToken(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7); // Remove "Bearer " prefix
}

