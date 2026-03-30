import { cn } from "@/lib/utils";

type ImagePromptPlaceholderProps = {
  label?: string;
  title: string;
  prompt: string;
  aspect?: "square" | "portrait" | "landscape" | "panorama";
  tags?: string[];
  className?: string;
};

export function ImagePromptPlaceholder({
  label = "Image Prompt",
  title,
  prompt,
  aspect = "landscape",
  tags,
  className
}: ImagePromptPlaceholderProps) {
  return (
    <div className={cn("image-prompt", `image-prompt--${aspect}`, className)}>
      <div className="image-prompt__header">
        <span className="eyebrow">{label}</span>
        <strong>{title}</strong>
      </div>
      <p className="image-prompt__body">{prompt}</p>
      {tags && tags.length > 0 ? (
        <div className="image-prompt__tags" aria-label="Prompt tags">
          {tags.map((tag) => (
            <span key={tag} className="image-prompt__tag">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
