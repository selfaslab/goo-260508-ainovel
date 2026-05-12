import type { ReactNode } from "react";
import { Image as ImageIcon, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import type { Scene } from "../../types/story";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { SceneImage } from "./SceneImage";

interface SceneCardProps {
  scene: Scene;
  imageUrl?: string;
  imageLoading: boolean;
  dragHandle?: ReactNode;
  onEdit: (scene: Scene) => void;
  onGenerateImage: (scene: Scene) => void;
  onRegenerateImage: (scene: Scene) => void;
}

export function SceneCard({
  scene,
  imageUrl,
  imageLoading,
  dragHandle,
  onEdit,
  onGenerateImage,
  onRegenerateImage,
}: SceneCardProps): JSX.Element {
  const label = `SCENE ${String(scene.sceneNumber).padStart(2, "0")}`;

  return (
    <Card className="space-y-4 border-zinc-800 bg-zinc-900/90">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          {dragHandle ? (
            <div className="mt-1 shrink-0 text-zinc-500">{dragHandle}</div>
          ) : null}
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.2em] text-purple-300">
              {label}
            </p>
            <h3 className="text-lg font-semibold text-zinc-50">{scene.title}</h3>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            className="px-3 py-1.5 text-xs"
            onClick={() => onEdit(scene)}
          >
            <Pencil className="h-4 w-4" />
            수정
          </Button>
          <Button
            type="button"
            variant="primary"
            className="px-3 py-1.5 text-xs"
            loading={imageLoading}
            onClick={() =>
              imageUrl ? onRegenerateImage(scene) : onGenerateImage(scene)
            }
          >
            <ImageIcon className="h-4 w-4" />
            {imageUrl ? "이미지 재생성" : "이미지 생성"}
          </Button>
        </div>
      </div>

      <motion.p
        layout
        className="text-sm leading-relaxed text-zinc-300"
      >
        {scene.story}
      </motion.p>

      <SceneImage
        src={imageUrl}
        alt={`${label} illustration`}
        loading={imageLoading}
      />
    </Card>
  );
}
