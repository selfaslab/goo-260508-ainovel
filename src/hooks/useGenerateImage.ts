import { useMutation } from "@tanstack/react-query";
import { generateSceneImage } from "../services/imageService";
import { useStoryStore } from "../store/storyStore";
import type { Scene } from "../types/story";

export function useGenerateImage() {
  const storyConfig = useStoryStore((s) => s.storyConfig);
  const generatedStory = useStoryStore((s) => s.generatedStory);
  const setImageForScene = useStoryStore((s) => s.setImageForScene);
  const setImageLoadingSceneNumber = useStoryStore(
    (s) => s.setImageLoadingSceneNumber
  );
  const setImageError = useStoryStore((s) => s.setImageError);

  return useMutation({
    mutationFn: async (scene: Scene) => {
      if (!generatedStory) {
        throw new Error("먼저 스토리를 생성해주세요.");
      }
      const storyTitle =
        generatedStory.title.trim().length > 0
          ? generatedStory.title
          : storyConfig.title;
      return generateSceneImage({
        scene,
        imageStyle: storyConfig.imageStyle,
        aspectRatio: storyConfig.aspectRatio,
        storyTitle,
      });
    },
    onMutate: (scene) => {
      setImageError(null);
      setImageLoadingSceneNumber(scene.sceneNumber);
    },
    onSuccess: (data, scene) => {
      setImageForScene(scene.sceneNumber, data.imageUrl);
    },
    onError: (err) => {
      const msg =
        err instanceof Error ? err.message : "이미지 생성에 실패했습니다.";
      setImageError(msg);
    },
    onSettled: () => {
      setImageLoadingSceneNumber(null);
    },
  });
}
