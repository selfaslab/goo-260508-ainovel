interface ChatChoice {
  message?: { content?: string };
}

interface ChatCompletionResponse {
  choices?: ChatChoice[];
}

interface ImageData {
  url?: string;
}

interface ImageGenerationResponse {
  data?: ImageData[];
}

const OPENAI_BASE = "https://api.openai.com/v1";

export async function openaiChatJson(params: {
  apiKey: string;
  system: string;
  user: string;
}): Promise<string> {
  const response = await fetch(`${OPENAI_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.85,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: params.system },
        { role: "user", content: params.user },
      ],
    }),
  });

  const raw = (await response.json()) as ChatCompletionResponse & {
    error?: { message?: string };
  };

  if (!response.ok) {
    const msg = raw.error?.message ?? `OpenAI chat error (${response.status})`;
    throw new Error(msg);
  }

  const content = raw.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenAI 응답이 비어 있습니다.");
  return content;
}

export async function openaiGenerateImage(params: {
  apiKey: string;
  prompt: string;
  size: "1024x1024" | "1792x1024" | "1024x1792";
}): Promise<string> {
  const response = await fetch(`${OPENAI_BASE}/images/generations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: params.prompt,
      n: 1,
      size: params.size,
      quality: "standard",
    }),
  });

  const raw = (await response.json()) as ImageGenerationResponse & {
    error?: { message?: string };
  };

  if (!response.ok) {
    const msg = raw.error?.message ?? `OpenAI image error (${response.status})`;
    throw new Error(msg);
  }

  const url = raw.data?.[0]?.url;
  if (!url) throw new Error("이미지 URL을 받지 못했습니다.");
  return url;
}
