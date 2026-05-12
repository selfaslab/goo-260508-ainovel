import { useMutation } from "@tanstack/react-query";
import { reviseScene } from "../services/storyService";
import { useStoryStore } from "../store/storyStore";
import type { Scene } from "../types/story";

export function useSceneEdit() {
  const storyConfig = useStoryStore((s) => s.storyConfig);
  const customPrompt = useStoryStore((s) => s.customPrompt);
  const generatedStory = useStoryStore((s) => s.generatedStory);
  const editScene = useStoryStore((s) => s.editScene);

  return useMutation({
    mutationFn: async (input: { scene: Scene; instruction: string }) => {
      if (!generatedStory) {
        throw new Error("스토리가 없습니다.");
      }
      return reviseScene({
        storyConfig,
        customPrompt,
        fullStory: generatedStory,
        sceneNumber: input.scene.sceneNumber,
        revisionInstruction: input.instruction,
      });
    },
    onSuccess: (nextScene) => {
      editScene(nextScene.sceneNumber, {
        title: nextScene.title,
        story: nextScene.story,
      });
    },
  });
}
