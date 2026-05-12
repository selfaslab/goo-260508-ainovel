import { Reorder, useDragControls } from "framer-motion";
import { GripVertical } from "lucide-react";
import type { Scene } from "../../types/story";
import { useGenerateImage } from "../../hooks/useGenerateImage";
import { useStoryStore } from "../../store/storyStore";
import { SceneCard } from "./SceneCard";

interface StoryListProps {
  scenes: Scene[];
}

interface SceneReorderItemProps {
  scene: Scene;
  imageUrl?: string;
  imageLoading: boolean;
  onEdit: (scene: Scene) => void;
  imageMutation: ReturnType<typeof useGenerateImage>;
}

function SceneReorderItem({
  scene,
  imageUrl,
  imageLoading,
  onEdit,
  imageMutation,
}: SceneReorderItemProps): JSX.Element {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={scene}
      dragListener={false}
      dragControls={controls}
      className="list-none"
    >
      <SceneCard
        scene={scene}
        imageUrl={imageUrl}
        imageLoading={imageLoading}
        dragHandle={
          <button
            type="button"
            aria-label="Scene 순서 변경"
            className="rounded-lg border border-zinc-800 bg-zinc-950 p-1 text-zinc-500 transition hover:border-purple-500 hover:text-purple-200"
            onPointerDown={(e) => controls.start(e)}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        }
        onEdit={onEdit}
        onGenerateImage={(s) => {
          imageMutation.mutate(s);
        }}
        onRegenerateImage={(s) => {
          imageMutation.mutate(s);
        }}
      />
    </Reorder.Item>
  );
}

export function StoryList({ scenes }: StoryListProps): JSX.Element {
  const sceneImages = useStoryStore((s) => s.sceneImages);
  const imageLoadingSceneNumber = useStoryStore(
    (s) => s.imageLoadingSceneNumber
  );
  const reorderScenes = useStoryStore((s) => s.reorderScenes);
  const setSelectedScene = useStoryStore((s) => s.setSelectedScene);
  const imageMutation = useGenerateImage();

  if (scenes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-6 text-center text-sm text-zinc-500">
        Scene이 아직 없습니다. 생성 버튼을 눌러 스토리를 만들어보세요.
      </div>
    );
  }

  return (
    <Reorder.Group
      axis="y"
      values={scenes}
      onReorder={reorderScenes}
      className="space-y-4"
    >
      {scenes.map((scene) => (
        <SceneReorderItem
          key={scene.sceneNumber}
          scene={scene}
          imageUrl={sceneImages[String(scene.sceneNumber)]}
          imageLoading={imageLoadingSceneNumber === scene.sceneNumber}
          onEdit={(s) => setSelectedScene(s)}
          imageMutation={imageMutation}
        />
      ))}
    </Reorder.Group>
  );
}
