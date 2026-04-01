import { buildSiteImageUrl } from "@/lib/site-media";
import { siteConfig } from "@/lib/site-config";

export const defaultOgImage = {
  url: buildSiteImageUrl("home", "1.png"),
  width: 768,
  height: 960,
  alt: "ZenUP NAD+ supplement hero scene."
};

export function toAbsoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
