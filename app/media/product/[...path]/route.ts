import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getProductImageRoot } from "@/lib/product-media";

const contentTypes: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

type ProductMediaRouteProps = {
  params: Promise<{
    path: string[];
  }>;
};

export async function GET(_: Request, { params }: ProductMediaRouteProps) {
  const resolved = await params;
  const segments = resolved.path || [];

  if (segments.length < 2) {
    return new NextResponse("Invalid path.", { status: 400 });
  }

  const root = getProductImageRoot();
  const folderSegments = segments.slice(0, -1);
  const fileName = segments[segments.length - 1];
  const targetPath = path.normalize(path.join(root, ...folderSegments, fileName));

  if (!targetPath.startsWith(root)) {
    return new NextResponse("Invalid path.", { status: 400 });
  }

  try {
    const file = await readFile(targetPath);
    const extension = path.extname(targetPath).toLowerCase();

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentTypes[extension] || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return new NextResponse("File not found.", { status: 404 });
  }
}
