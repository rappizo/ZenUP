import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const PRODUCT_MEDIA_FOLDERS: Record<string, string> = {
  "zenup-nad-plus-nicotinamide-riboside": "ZenUP NAD+ Supplement"
};

export function getProductImageRoot() {
  const singular = path.join(process.cwd(), "images", "product image");
  const plural = path.join(process.cwd(), "images", "product images");
  return existsSync(singular) ? singular : plural;
}

export function buildProductMediaUrl(folder: string, fileName: string) {
  return `/media/product/${encodeURIComponent(folder)}/${encodeURIComponent(fileName)}`;
}

export function getProductMediaFolder(slug: string) {
  return PRODUCT_MEDIA_FOLDERS[slug] ?? null;
}

function sortProductMediaFileNames(fileNames: string[]) {
  return [...fileNames].sort((left, right) => {
    const leftNumber = Number.parseInt(left.replace(/\D/g, ""), 10);
    const rightNumber = Number.parseInt(right.replace(/\D/g, ""), 10);

    if (Number.isFinite(leftNumber) && Number.isFinite(rightNumber) && leftNumber !== rightNumber) {
      return leftNumber - rightNumber;
    }

    return left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });
  });
}

export function getLocalProductGallery(slug: string) {
  const folder = getProductMediaFolder(slug);

  if (!folder) {
    return [];
  }

  const directory = path.join(getProductImageRoot(), folder);

  if (!existsSync(directory)) {
    return [];
  }

  const fileNames = readdirSync(directory).filter((fileName) => /\.(png|jpe?g|webp|avif)$/i.test(fileName));

  return sortProductMediaFileNames(fileNames).map((fileName) => buildProductMediaUrl(folder, fileName));
}

export function getDefaultProductImageUrl(slug: string) {
  return getLocalProductGallery(slug)[0] ?? null;
}

function getMimeTypeForFileName(fileName: string) {
  if (/\.png$/i.test(fileName)) {
    return "image/png";
  }

  if (/\.webp$/i.test(fileName)) {
    return "image/webp";
  }

  return "image/jpeg";
}

export function getDefaultProductImageReferenceAsset(slug: string) {
  const folder = getProductMediaFolder(slug);

  if (!folder) {
    return null;
  }

  const directory = path.join(getProductImageRoot(), folder);

  if (!existsSync(directory)) {
    return null;
  }

  const fileName = sortProductMediaFileNames(
    readdirSync(directory).filter((item) => /\.(png|jpe?g|webp)$/i.test(item))
  )[0];

  if (!fileName) {
    return null;
  }

  return {
    fileName,
    mimeType: getMimeTypeForFileName(fileName),
    data: readFileSync(path.join(directory, fileName))
  };
}
