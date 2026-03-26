import { cn } from "@/lib/utils";

type ImagePromptPlaceholderProps = {
  label?: string;
  title: string;
  prompt: string;
  aspect?: "square" | "portrait" | "landscape" | "panorama";
};

export function ImagePromptPlaceholder({
  label = "Image Prompt",
  title,
  prompt,
  aspect = "landscape"
}: ImagePromptPlaceholderProps) {
  return (
    <div className={cn("image-prompt", `image-prompt--${aspect}`)}>
      <div className="image-prompt__header">
        <span className="eyebrow">{label}</span>
        <strong>{title}</strong>
      </div>
      <p className="image-prompt__body">{prompt}</p>
    </div>
  );
}
