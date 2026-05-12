import type { IncomingMessage, ServerResponse } from "node:http";
import {
  runGenerateImage,
  runGenerateStory,
  runReviseScene,
} from "../server/routes";

async function readJsonBody(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    if (typeof chunk === "string") {
      chunks.push(Buffer.from(chunk));
    } else {
      chunks.push(chunk);
    }
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return {};
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new Error("JSON 본문을 파싱할 수 없습니다.");
  }
}

function pathnameOnly(url: string): string {
  try {
    return new URL(url, "http://localhost").pathname;
  } catch {
    return url.split("?")[0] ?? url;
  }
}

export function devApiMiddleware(): (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
) => void {
  return (req, res, next) => {
    void handle(req, res, next);
  };
}

async function handle(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
): Promise<void> {
  const url = req.url ?? "";
  if (!url.startsWith("/api/")) {
    next();
    return;
  }

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const path = pathnameOnly(url);
    const parsedBody = await readJsonBody(req);

    let result;
    if (path === "/api/generate-story") {
      result = await runGenerateStory(parsedBody);
    } else if (path === "/api/generate-image") {
      result = await runGenerateImage(parsedBody);
    } else if (path === "/api/revise-scene") {
      result = await runReviseScene(parsedBody);
    } else {
      sendJson(res, 404, { error: "알 수 없는 API 경로입니다." });
      return;
    }

    sendJson(res, result.status, result.body);
  } catch (err) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    sendJson(res, 400, { error: message });
  }
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}
