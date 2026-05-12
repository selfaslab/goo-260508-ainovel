import { useMutation } from "@tanstack/react-query";
import { generateStory } from "../services/storyService";
import { useStoryStore } from "../store/storyStore";

export function useGenerateStory() {
  const storyConfig = useStoryStore((s) => s.storyConfig);
  const customPrompt = useStoryStore((s) => s.customPrompt);
  const setGeneratedStory = useStoryStore((s) => s.setGeneratedStory);
  const setStoryError = useStoryStore((s) => s.setStoryError);
  const setIsGeneratingStory = useStoryStore((s) => s.setIsGeneratingStory);
  const setSceneImages = useStoryStore((s) => s.setSceneImages);
  const setImageError = useStoryStore((s) => s.setImageError);

  return useMutation({
    mutationFn: async () => {
      setStoryError(null);
      return generateStory({ storyConfig, customPrompt });
    },
    onMutate: () => {
      setIsGeneratingStory(true);
    },
    onSuccess: (data) => {
      setSceneImages({});
      setImageError(null);
      setGeneratedStory(data);
    },
    onError: (err) => {
      const msg =
        err instanceof Error ? err.message : "스토리 생성에 실패했습니다.";
      setStoryError(msg);
    },
    onSettled: () => {
      setIsGeneratingStory(false);
    },
  });
}
