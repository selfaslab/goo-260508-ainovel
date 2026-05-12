import { apiPostJson } from "./apiClient";
import type {
  GeneratedStory,
  GenerateStoryRequestBody,
  ReviseSceneRequestBody,
  Scene,
} from "../types/story";

export async function generateStory(
  body: GenerateStoryRequestBody
): Promise<GeneratedStory> {
  return apiPostJson<GeneratedStory>("/api/generate-story", body);
}

export async function reviseScene(
  body: ReviseSceneRequestBody
): Promise<Scene> {
  return apiPostJson<Scene>("/api/revise-scene", body);
}
