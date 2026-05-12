import { apiPostJson } from "./apiClient";
import type { GenerateImageRequestBody } from "../types/story";

export interface GenerateImageResponse {
  imageUrl: string;
}

export async function generateSceneImage(
  body: GenerateImageRequestBody
): Promise<GenerateImageResponse> {
  return apiPostJson<GenerateImageResponse>("/api/generate-image", body);
}
