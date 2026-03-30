import { buildSiteImageUrl } from "@/lib/site-media";
import { siteConfig } from "@/lib/site-config";

export const defaultOgImage = {
  url: buildSiteImageUrl("home", "ZenUP Hero Main.png"),
  width: 768,
  height: 768,
  alt: "ZenUP NAD+ supplement bottle."
};

export function toAbsoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}
