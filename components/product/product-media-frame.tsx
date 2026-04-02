import Image from "next/image";
import { cn } from "@/lib/utils";

type ProductMediaFrameProps = {
  src: string;
  alt: string;
  ratio?: "square" | "portrait" | "landscape" | "wide" | "four-three" | "two-three";
  sizes: string;
  priority?: boolean;
  className?: string;
};

export function ProductMediaFrame({
  src,
  alt,
  ratio = "square",
  sizes,
  priority = false,
  className
}: ProductMediaFrameProps) {
  return (
    <div className={cn("product-landing__image-frame", `product-landing__image-frame--${ratio}`, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        priority={priority}
        sizes={sizes}
        className="product-landing__image"
      />
    </div>
  );
}
