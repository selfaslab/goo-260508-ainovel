import { openaiChatJson, openaiGenerateImage } from "../api/lib/openai";
import {
  buildUserPrompt,
  parseStoryConfig,
  sceneCountFromLength,
  type ApiScene,
} from "../api/lib/storyPayload";
import { parseGeneratedStoryJson } from "../api/lib/validateStoryJson";

export type ApiRouteResult = {
  status: number;
  body: unknown;
};

const STORY_SYSTEM_PROMPT = `당신은 세계 최고 수준의 그래픽노블 스토리 작가다.

사용자가 제공한 설정을 바탕으로 Scene 기반 그래픽노블을 작성하라.

규칙:
1. 요청된 총 Scene 수를 정확히 지켜라.
2. 각 Scene에 제목을 포함하라.
3. 각 Scene 본문은 200~400자 분량으로 작성하라.
4. 감정선을 일관되게 유지하라.
5. 캐릭터 설정을 일관되게 유지하라.
6. 이미지 생성에 적합한 시각적 장면 묘사를 포함하라.
7. 사용자의 자유 입력(추가 요청)을 최우선으로 반영하라.
8. 설정값이 충돌하면 추가 요청과 주요 설정(장르/분위기/배경)을 우선하라.
9. 반드시 JSON만 반환하라. 코드블록이나 설명 텍스트를 붙이지 마라.
10. 전체 이야기가 자연스럽게 연결되도록 작성하라.

JSON 스키마:
{
  "title": string,
  "theme": string,
  "scenes": [
    { "sceneNumber": number, "title": string, "story": string }
  ]
}`;

export async function runGenerateStory(
  parsedBody: unknown
): Promise<ApiRouteResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      status: 500,
      body: { error: "서버에 OPENAI_API_KEY가 설정되어 있지 않습니다." },
    };
  }

  try {
    const body = parsedBody as {
      storyConfig?: unknown;
      customPrompt?: unknown;
    };
    const storyConfig = parseStoryConfig(body?.storyConfig);
    const customPrompt =
      typeof body?.customPrompt === "string" ? body.customPrompt : "";

    if (!storyConfig) {
      return { status: 400, body: { error: "storyConfig 형식이 올바르지 않습니다." } };
    }

    const sceneCount = sceneCountFromLength(storyConfig.storyLength);
    const user = buildUserPrompt({ config: storyConfig, customPrompt, sceneCount });

    const content = await openaiChatJson({
      apiKey,
      system: STORY_SYSTEM_PROMPT,
      user,
    });

    const parsed = parseGeneratedStoryJson(content);
    if (parsed.scenes.length !== sceneCount) {
      return {
        status: 422,
        body: {
          error: `Scene 개수가 맞지 않습니다. (요청: ${sceneCount}, 응답: ${parsed.scenes.length})`,
        },
      };
    }

    const normalizedScenes = parsed.scenes.map((sc, idx) => ({
      ...sc,
      sceneNumber: idx + 1,
    }));

    return {
      status: 200,
      body: {
        title: parsed.title,
        theme: parsed.theme,
        scenes: normalizedScenes,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return { status: 500, body: { error: message } };
  }
}

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

function mapAspectToSize(
  aspect: string
): "1024x1024" | "1792x1024" | "1024x1792" {
  if (aspect === "1:1") return "1024x1024";
  if (aspect === "16:9") return "1792x1024";
  if (aspect === "4:5" || aspect === "9:16") return "1024x1792";
  return "1792x1024";
}

function buildImagePrompt(params: {
  storyTitle: string;
  scene: ApiScene;
  imageStyle: string;
}): string {
  const styleMap: Record<string, string> = {
    "웹툰 스타일": "Korean webtoon panel, clean lineart, vivid flat colors",
    "일본 애니": "high quality anime illustration, cel shading, detailed eyes",
    시네마틱: "cinematic lighting, dramatic composition, film still",
    수채화: "soft watercolor illustration, paper texture",
    유화: "oil painting style, rich brush strokes",
    "흑백 만화": "black and white graphic novel ink art, high contrast",
    "노벨 일러스트": "light novel cover illustration, polished digital paint",
    지브리풍: "Studio Ghibli inspired background art, warm painterly anime",
    픽사풍: "Pixar-like 3D render, expressive characters, colorful",
    사이버펑크: "cyberpunk neon city, rain reflections, futuristic fashion",
  };

  const englishStyle =
    styleMap[params.imageStyle] ??
    "graphic novel illustration, polished digital art";

  return [
    `Graphic novel scene for "${params.storyTitle}".`,
    `Scene title: ${params.scene.title}.`,
    "Visualize the following moment as a single key illustration:",
    params.scene.story,
    "",
    `Art direction: ${englishStyle}.`,
    "Absolutely no text, letters, numbers, signage, subtitles, logos, watermarks, speech bubbles, captions, typography, or written language of any kind (Korean, English, or other). Illustration only — purely visual storytelling without readable characters.",
  ].join(" ");
}

export async function runGenerateImage(
  parsedBody: unknown
): Promise<ApiRouteResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      status: 500,
      body: { error: "서버에 OPENAI_API_KEY가 설정되어 있지 않습니다." },
    };
  }

  try {
    const body = parsedBody as {
      scene?: unknown;
      imageStyle?: unknown;
      aspectRatio?: unknown;
      storyTitle?: unknown;
    };
    const scene = body?.scene;
    const imageStyle =
      typeof body?.imageStyle === "string" ? body.imageStyle : "";
    const aspectRatio =
      typeof body?.aspectRatio === "string" ? body.aspectRatio : "16:9";
    const storyTitle =
      typeof body?.storyTitle === "string" ? body.storyTitle : "";

    if (!isScene(scene)) {
      return { status: 400, body: { error: "scene 형식이 올바르지 않습니다." } };
    }
    if (!imageStyle) {
      return { status: 400, body: { error: "imageStyle이 필요합니다." } };
    }

    const prompt = buildImagePrompt({ storyTitle, scene, imageStyle });
    const size = mapAspectToSize(aspectRatio);

    const imageUrl = await openaiGenerateImage({
      apiKey,
      prompt,
      size,
    });

    return { status: 200, body: { imageUrl } };
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return { status: 500, body: { error: message } };
  }
}

const REVISE_SYSTEM = `당신은 그래픽노블 각색 전문 작가다.
전체 스토리 맥락과 캐릭터 일관성을 유지한 채, 지정된 Scene 하나만 수정하라.

규칙:
1. 수정된 Scene의 본문은 200~400자.
2. 장면 묘사는 이미지 생성에 적합하게 유지하라.
3. JSON 한 객체만 반환: { "sceneNumber": number, "title": string, "story": string }
4. sceneNumber는 입력과 동일해야 한다.`;

export async function runReviseScene(
  parsedBody: unknown
): Promise<ApiRouteResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      status: 500,
      body: { error: "서버에 OPENAI_API_KEY가 설정되어 있지 않습니다." },
    };
  }

  try {
    const body = parsedBody as {
      storyConfig?: unknown;
      customPrompt?: unknown;
      fullStory?: unknown;
      sceneNumber?: unknown;
      revisionInstruction?: unknown;
    };
    const storyConfig = parseStoryConfig(body?.storyConfig);
    const customPrompt =
      typeof body?.customPrompt === "string" ? body.customPrompt : "";
    const fullStory = body?.fullStory;
    const sceneNumber =
      typeof body?.sceneNumber === "number" ? body.sceneNumber : NaN;
    const revisionInstruction =
      typeof body?.revisionInstruction === "string"
        ? body.revisionInstruction
        : "";

    if (!storyConfig) {
      return { status: 400, body: { error: "storyConfig 형식이 올바르지 않습니다." } };
    }
    if (!Number.isFinite(sceneNumber)) {
      return { status: 400, body: { error: "sceneNumber가 필요합니다." } };
    }
    if (!revisionInstruction.trim()) {
      return { status: 400, body: { error: "revisionInstruction이 필요합니다." } };
    }
    if (!isRecord(fullStory) || typeof fullStory.title !== "string") {
      return { status: 400, body: { error: "fullStory 형식이 올바르지 않습니다." } };
    }

    const scenesUnknown: unknown = fullStory.scenes;
    if (!Array.isArray(scenesUnknown) || !scenesUnknown.every(isScene)) {
      return {
        status: 400,
        body: { error: "fullStory.scenes 형식이 올바르지 않습니다." },
      };
    }
    const scenes: ApiScene[] = scenesUnknown;

    const target = scenes.find((s) => s.sceneNumber === sceneNumber);
    if (!target) {
      return { status: 404, body: { error: "해당 Scene을 찾을 수 없습니다." } };
    }

    const sceneCount = sceneCountFromLength(storyConfig.storyLength);
    const settingBlock = buildUserPrompt({
      config: storyConfig,
      customPrompt,
      sceneCount,
    });

    const storyDigest = scenes
      .map(
        (s) =>
          `SCENE ${String(s.sceneNumber).padStart(2, "0")} — ${s.title}\n${s.story}`
      )
      .join("\n\n");

    const user = [
      settingBlock,
      "",
      "현재 전체 스토리:",
      storyDigest,
      "",
      `수정 대상 Scene 번호: ${sceneNumber}`,
      "현재 내용:",
      JSON.stringify(target, null, 2),
      "",
      "수정 요청:",
      revisionInstruction,
      "",
      "위 요청을 반영해 해당 Scene만 재작성하고 JSON 한 개로 반환하라.",
    ].join("\n");

    const content = await openaiChatJson({
      apiKey,
      system: REVISE_SYSTEM,
      user,
    });

    const parsedUnknown: unknown = JSON.parse(content);
    if (!isScene(parsedUnknown)) {
      return {
        status: 422,
        body: { error: "수정 결과 JSON 형식이 올바르지 않습니다." },
      };
    }
    if (parsedUnknown.sceneNumber !== sceneNumber) {
      return { status: 422, body: { error: "sceneNumber가 일치하지 않습니다." } };
    }

    return {
      status: 200,
      body: {
        sceneNumber: parsedUnknown.sceneNumber,
        title: parsedUnknown.title,
        story: parsedUnknown.story,
      },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return { status: 500, body: { error: message } };
  }
}
