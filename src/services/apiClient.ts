export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

export async function apiPostJson<TResponse>(
  path: string,
  body: unknown
): Promise<TResponse> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload = await parseJsonSafe(response);

  if (!response.ok) {
    if (response.status === 404) {
      const payloadError =
        typeof payload === "object" &&
        payload !== null &&
        "error" in payload &&
        typeof (payload as { error: unknown }).error === "string"
          ? (payload as { error: string }).error
          : null;

      if (payloadError) {
        throw new ApiError(payloadError, 404, payload);
      }

      throw new ApiError(
        "API 경로를 찾을 수 없습니다(404). 배포 환경이면 Vercel에 프로젝트와 `api/` 함수가 연결됐는지 확인하세요.",
        404,
        payload
      );
    }

    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof (payload as { error: unknown }).error === "string"
        ? (payload as { error: string }).error
        : `요청 실패 (${response.status})`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as TResponse;
}
