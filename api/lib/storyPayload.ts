export interface ApiProtagonist {
  name: string;
  gender: string;
  age: string;
  appearance: string;
  personality: string;
  goal: string;
  trauma: string;
}

export interface ApiExtraCharacter {
  id: string;
  name: string;
  role: string;
  appearance: string;
  personality: string;
  relationship: string;
  secret: string;
}

export interface ApiStoryConfig {
  title: string;
  genres: string[];
  mood: string;
  setting: string;
  storyLength: "short" | "normal" | "long";
  structure: string;
  protagonist: ApiProtagonist;
  extraCharacters: ApiExtraCharacter[];
  imageStyle: string;
  aspectRatio: string;
  keywords: string[];
}

export interface ApiScene {
  sceneNumber: number;
  title: string;
  story: string;
}

export interface ApiGeneratedStory {
  title: string;
  theme: string;
  scenes: ApiScene[];
}

export function sceneCountFromLength(length: ApiStoryConfig["storyLength"]): number {
  if (length === "short") return 5;
  if (length === "long") return 20;
  return 10;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === "string");
}

function isProtagonist(value: unknown): value is ApiProtagonist {
  if (!isRecord(value)) return false;
  const keys = [
    "name",
    "gender",
    "age",
    "appearance",
    "personality",
    "goal",
    "trauma",
  ] as const;
  return keys.every((k) => typeof value[k] === "string");
}

function isExtraCharacter(value: unknown): value is ApiExtraCharacter {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.role === "string" &&
    typeof value.appearance === "string" &&
    typeof value.personality === "string" &&
    typeof value.relationship === "string" &&
    typeof value.secret === "string"
  );
}

export function parseStoryConfig(value: unknown): ApiStoryConfig | null {
  if (!isRecord(value)) return null;
  const {
    title,
    genres,
    mood,
    setting,
    storyLength,
    structure,
    protagonist,
    extraCharacters,
    imageStyle,
    aspectRatio,
    keywords,
  } = value;
  if (typeof title !== "string") return null;
  if (!isStringArray(genres)) return null;
  if (typeof mood !== "string") return null;
  if (typeof setting !== "string") return null;
  if (storyLength !== "short" && storyLength !== "normal" && storyLength !== "long")
    return null;
  if (typeof structure !== "string") return null;
  if (!isProtagonist(protagonist)) return null;
  if (!Array.isArray(extraCharacters) || !extraCharacters.every(isExtraCharacter))
    return null;
  if (typeof imageStyle !== "string") return null;
  if (typeof aspectRatio !== "string") return null;
  if (!isStringArray(keywords)) return null;

  return {
    title,
    genres,
    mood,
    setting,
    storyLength,
    structure,
    protagonist,
    extraCharacters,
    imageStyle,
    aspectRatio,
    keywords,
  };
}

export function buildCharactersBlock(config: ApiStoryConfig): string {
  const p = config.protagonist;
  const lines: string[] = [
    "주인공:",
    `- 이름: ${p.name || "(미입력)"}`,
    `- 성별: ${p.gender || "(미입력)"}`,
    `- 나이: ${p.age || "(미입력)"}`,
    `- 외형: ${p.appearance || "(미입력)"}`,
    `- 성격: ${p.personality || "(미입력)"}`,
    `- 목표: ${p.goal || "(미입력)"}`,
    `- 트라우마: ${p.trauma || "(미입력)"}`,
  ];

  if (config.extraCharacters.length > 0) {
    lines.push("", "추가 캐릭터:");
    config.extraCharacters.forEach((c, idx) => {
      lines.push(
        `${idx + 1}. ${c.name || "이름 미정"} (${c.role || "역할 미정"})`,
        `   외형: ${c.appearance}`,
        `   성격: ${c.personality}`,
        `   관계: ${c.relationship}`,
        `   비밀: ${c.secret}`
      );
    });
  }

  return lines.join("\n");
}

export function buildUserPrompt(params: {
  config: ApiStoryConfig;
  customPrompt: string;
  sceneCount: number;
}): string {
  const { config, customPrompt, sceneCount } = params;
  const characters = buildCharactersBlock(config);
  const keywords = config.keywords.length > 0 ? config.keywords.join(", ") : "(없음)";

  return [
    `작품 제목:\n${config.title || "(제목 미정)"}`,
    "",
    `장르:\n${config.genres.length > 0 ? config.genres.join(", ") : "(미선택)"}`,
    "",
    `분위기:\n${config.mood}`,
    "",
    `배경:\n${config.setting}`,
    "",
    `이야기 구조:\n${config.structure}`,
    "",
    `등장인물:\n${characters}`,
    "",
    `키워드:\n${keywords}`,
    "",
    `이미지 스타일:\n${config.imageStyle}`,
    "",
    `총 Scene 수:\n정확히 ${sceneCount}개`,
    "",
    `추가 요청(최우선):\n${customPrompt.trim() || "(없음)"}`,
    "",
    "반드시 Scene 기반 JSON으로만 응답하라.",
  ].join("\n");
}
