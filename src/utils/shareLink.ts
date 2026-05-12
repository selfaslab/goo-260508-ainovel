import type { GeneratedStory, Scene } from "../types/story";

function isScene(value: unknown): value is Scene {
  if (typeof value !== "object" || value === null) return false;
  const s = value as Record<string, unknown>;
  return (
    typeof s.sceneNumber === "number" &&
    typeof s.title === "string" &&
    typeof s.story === "string"
  );
}

function isGeneratedStory(value: unknown): value is GeneratedStory {
  if (typeof value !== "object" || value === null) return false;
  const s = value as Record<string, unknown>;
  if (typeof s.title !== "string" || typeof s.theme !== "string") return false;
  if (!Array.isArray(s.scenes) || !s.scenes.every(isScene)) return false;
  return true;
}

function isStringRecord(value: unknown): value is Record<string, string> {
  if (typeof value !== "object" || value === null) return false;
  return Object.entries(value as Record<string, unknown>).every(
    ([k, v]) => typeof k === "string" && typeof v === "string"
  );
}

export function buildShareUrl(
  story: GeneratedStory,
  images: Record<string, string>
): string {
  const payload = { v: 1 as const, story, images };
  const json = JSON.stringify(payload);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  const url = new URL(window.location.href);
  url.hash = `share=${base64}`;
  return url.toString();
}

export function parseShareFromLocation(): {
  story: GeneratedStory;
  images: Record<string, string>;
} | null {
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash.startsWith("share=")) return null;
  const raw = hash.slice("share=".length);
  try {
    const json = decodeURIComponent(escape(atob(raw)));
    const parsed: unknown = JSON.parse(json);
    if (typeof parsed !== "object" || parsed === null) return null;
    const rec = parsed as { story?: unknown; images?: unknown };
    if (!isGeneratedStory(rec.story)) return null;
    if (!isStringRecord(rec.images)) return null;
    return { story: rec.story, images: rec.images };
  } catch {
    return null;
  }
}
