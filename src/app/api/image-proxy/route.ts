import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");
  const w = searchParams.get("w");
  const q = searchParams.get("q");

  if (!imageUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    // Validate that it's a proper URL
    const url = new URL(imageUrl);

    // Only allow HTTPS URLs for security
    if (url.protocol !== "https:") {
      return new NextResponse("Only HTTPS URLs are allowed", { status: 400 });
    }

    // Fetch the image
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent": "NextJS Image Proxy",
      },
    });

    if (!response.ok) {
      return new NextResponse("Failed to fetch image", { status: response.status });
    }

    const contentType = response.headers.get("content-type");

    // Ensure it's an image
    if (!contentType || !contentType.startsWith("image/")) {
      return new NextResponse("URL does not point to an image", { status: 400 });
    }

    const imageBuffer = await response.arrayBuffer();

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": imageBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
