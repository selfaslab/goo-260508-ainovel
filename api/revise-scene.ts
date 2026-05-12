import type { VercelRequest, VercelResponse } from "@vercel/node";
import { runReviseScene } from "../server/routes";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const result = await runReviseScene(body);
  void res.status(result.status).json(result.body);
}
