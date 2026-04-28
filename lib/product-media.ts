import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

type ProductMediaFolderPath = string[];

const PRODUCT_MEDIA_FOLDERS: Record<string, ProductMediaFolderPath> = {
  "zenup-nad-plus-nicotinamide-riboside": ["ZenUP NAD+ Supplement"],
  "zenup-nmn-supplement-60ct": ["ZenUP NMN Supplement", "60ct"],
  "zenup-nmn-supplement-90ct": ["ZenUP NMN Supplement", "90ct"],
  "zenup-nmn-supplement-120ct": ["ZenUP NMN Supplement", "120ct"]
};

const defaultNmnGallery = ["Main.png", "1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png"];
const defaultNmnDetailImages = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png"];

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
  },
  "zenup-nmn-supplement-60ct": {
    defaultImage: "Main.png",
    gallery: defaultNmnGallery,
    detailImages: defaultNmnDetailImages
  },
  "zenup-nmn-supplement-90ct": {
    defaultImage: "Main.png",
    gallery: defaultNmnGallery,
    detailImages: defaultNmnDetailImages
  },
  "zenup-nmn-supplement-120ct": {
    defaultImage: "Main.png",
    gallery: defaultNmnGallery,
    detailImages: defaultNmnDetailImages
  }
};

export function getProductImageRoot() {
  const singular = path.join(process.cwd(), "images", "product image");
  const plural = path.join(process.cwd(), "images", "product images");
  return existsSync(singular) ? singular : plural;
}

function normalizeFolderPath(folderPath: string | string[]) {
  const segments = Array.isArray(folderPath) ? folderPath : folderPath.split("/").filter(Boolean);
  return segments.map((segment) => segment.trim()).filter(Boolean);
}

function getProductMediaDirectory(folderPath: string | string[]) {
  return path.join(getProductImageRoot(), ...normalizeFolderPath(folderPath));
}

export function buildProductMediaUrl(folderPath: string | string[], fileName: string) {
  const folderSegments = normalizeFolderPath(folderPath);
  return `/media/product/${[...folderSegments, fileName].map((segment) => encodeURIComponent(segment)).join("/")}`;
}

export function getProductMediaFolder(slug: string) {
  return PRODUCT_MEDIA_FOLDERS[slug] ?? null;
}

function getExistingProductMediaFileNames(slug: string, fileNames: string[]) {
  const folderPath = getProductMediaFolder(slug);

  if (!folderPath) {
    return [];
  }

  const directory = getProductMediaDirectory(folderPath);

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
  const folderPath = getProductMediaFolder(slug);

  if (!folderPath) {
    return [];
  }

  if (preset?.gallery?.length) {
    return getExistingProductMediaFileNames(slug, preset.gallery).map((fileName) =>
      buildProductMediaUrl(folderPath, fileName)
    );
  }

  const directory = getProductMediaDirectory(folderPath);

  if (!existsSync(directory)) {
    return [];
  }

  const fileNames = readdirSync(directory).filter((fileName) => /\.(png|jpe?g|webp|avif)$/i.test(fileName));

  return sortProductMediaFileNames(fileNames).map((fileName) => buildProductMediaUrl(folderPath, fileName));
}

export function getDefaultProductImageUrl(slug: string) {
  const preset = PRODUCT_MEDIA_PRESETS[slug];
  const folderPath = getProductMediaFolder(slug);

  if (folderPath && preset?.defaultImage && getExistingProductMediaFileNames(slug, [preset.defaultImage]).length > 0) {
    return buildProductMediaUrl(folderPath, preset.defaultImage);
  }

  return getLocalProductGallery(slug)[0] ?? null;
}

export function getProductDetailImages(slug: string) {
  const preset = PRODUCT_MEDIA_PRESETS[slug];
  const folderPath = getProductMediaFolder(slug);

  if (!folderPath || !preset?.detailImages?.length) {
    return [];
  }

  return getExistingProductMediaFileNames(slug, preset.detailImages).map((fileName) =>
    buildProductMediaUrl(folderPath, fileName)
  );
}

export function getProductSupplementFactsImageUrl(slug: string) {
  const preset = PRODUCT_MEDIA_PRESETS[slug];
  const folderPath = getProductMediaFolder(slug);

  if (!folderPath || !preset?.supplementFacts) {
    return null;
  }

  if (getExistingProductMediaFileNames(slug, [preset.supplementFacts]).length === 0) {
    return null;
  }

  return buildProductMediaUrl(folderPath, preset.supplementFacts);
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
  const folderPath = getProductMediaFolder(slug);

  if (!folderPath) {
    return null;
  }

  const directory = getProductMediaDirectory(folderPath);

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
