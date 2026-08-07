import { cn } from "@/lib/utils";
import { Play, ImageIcon } from "lucide-react";
import type { SourceMedia } from "@/lib/types";

// Mock media preview — gradient placeholder keyed by thumbUrl id.
// Part B swaps the gradient for the real image/video thumbnail.
const GRADIENTS: Record<string, string> = {
  g1: "linear-gradient(135deg, #1e3a5f 0%, #0f1d30 100%)",
  g2: "linear-gradient(135deg, #14532d 0%, #052012 100%)",
  g3: "linear-gradient(135deg, #581c87 0%, #1e0a33 100%)",
  g4: "linear-gradient(135deg, #7c2d12 0%, #2a0e05 100%)",
  g5: "linear-gradient(135deg, #713f12 0%, #271504 100%)",
  g6: "linear-gradient(135deg, #7f1d1d 0%, #2a0808 100%)",
  g7: "linear-gradient(135deg, #164e63 0%, #061e27 100%)",
  g8: "linear-gradient(135deg, #3f3f46 0%, #131316 100%)",
};

export function MediaThumb({
  media,
  className,
  showCredit = true,
}: {
  media: SourceMedia;
  className?: string;
  showCredit?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border",
        className,
      )}
      style={{ background: GRADIENTS[media.thumbUrl] ?? GRADIENTS.g8 }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        {media.type === "video" ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
            <Play className="h-4 w-4 fill-white text-white" />
          </span>
        ) : (
          <ImageIcon className="h-5 w-5 text-white/40" />
        )}
      </div>
      {media.duration ? (
        <span className="tnum absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
          {media.duration}
        </span>
      ) : null}
      {showCredit ? (
        <span className="absolute bottom-1.5 right-1.5 max-w-[70%] truncate rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white/90">
          From @{media.credit}
        </span>
      ) : null}
    </div>
  );
}
