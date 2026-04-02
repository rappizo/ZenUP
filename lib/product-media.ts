import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const PRODUCT_MEDIA_FOLDERS: Record<string, string> = {
  "zenup-nad-plus-nicotinamide-riboside": "ZenUP NAD+ Supplement"
};

const PRODUCT_MEDIA_PRESETS: Record<
  string,
  {
    defaultImage?: string;
    gallery?: string[];
    detailImages?: string[];
    supplementFacts?: string;
  }
> = {
  "zenup-nad-plus-nicotinamide-riboside": {
    defaultImage: "main3.png",
    gallery: ["main3.png", "02.png", "03.png", "04.png", "05.png", "06.png", "07.png"],
    detailImages: ["D1.png", "D2.png", "D3.png", "D4.png", "D5.png", "D6.png", "D7.png", "D8.png"],
    supplementFacts: "SF.jpg"
  }
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

function getExistingProductMediaFileNames(slug: string, fileNames: string[]) {
  const folder = getProductMediaFolder(slug);

  if (!folder) {
    return [];
  }

  const directory = path.join(getProductImageRoot(), folder);

  if (!existsSync(directory)) {
    return [];
  }

  return fileNames.filter((fileName) => existsSync(path.join(directory, fileName)));
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
  const preset = PRODUCT_MEDIA_PRESETS[slug];

  if (preset?.gallery?.length) {
    const folder = getProductMediaFolder(slug);

    if (!folder) {
      return [];
    }

    return getExistingProductMediaFileNames(slug, preset.gallery).map((fileName) =>
      buildProductMediaUrl(folder, fileName)
    );
  }

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
  const preset = PRODUCT_MEDIA_PRESETS[slug];

  if (preset?.defaultImage) {
    const folder = getProductMediaFolder(slug);

    if (folder && getExistingProductMediaFileNames(slug, [preset.defaultImage]).length > 0) {
      return buildProductMediaUrl(folder, preset.defaultImage);
    }
  }

  return getLocalProductGallery(slug)[0] ?? null;
}

export function getProductDetailImages(slug: string) {
  const preset = PRODUCT_MEDIA_PRESETS[slug];
  const folder = getProductMediaFolder(slug);

  if (!folder || !preset?.detailImages?.length) {
    return [];
  }

  return getExistingProductMediaFileNames(slug, preset.detailImages).map((fileName) =>
    buildProductMediaUrl(folder, fileName)
  );
}

export function getProductSupplementFactsImageUrl(slug: string) {
  const preset = PRODUCT_MEDIA_PRESETS[slug];
  const folder = getProductMediaFolder(slug);

  if (!folder || !preset?.supplementFacts) {
    return null;
  }

  if (getExistingProductMediaFileNames(slug, [preset.supplementFacts]).length === 0) {
    return null;
  }

  return buildProductMediaUrl(folder, preset.supplementFacts);
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
