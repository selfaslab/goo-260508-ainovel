import type { ApiGeneratedStory, ApiScene } from "./storyPayload";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isScene(value: unknown): value is ApiScene {
  if (!isRecord(value)) return false;
  return (
    typeof value.sceneNumber === "number" &&
    typeof value.title === "string" &&
    typeof value.story === "string"
  );
}

export function parseGeneratedStoryJson(text: string): ApiGeneratedStory {
  const parsed: unknown = JSON.parse(text);
  if (!isRecord(parsed)) throw new Error("JSON 형식이 올바르지 않습니다.");
  const title = parsed.title;
  const theme = parsed.theme;
  const scenes = parsed.scenes;
  if (typeof title !== "string") throw new Error("title 필드가 필요합니다.");
  if (typeof theme !== "string") throw new Error("theme 필드가 필요합니다.");
  if (!Array.isArray(scenes) || !scenes.every(isScene)) {
    throw new Error("scenes 배열이 올바르지 않습니다.");
  }
  return { title, theme, scenes };
}
