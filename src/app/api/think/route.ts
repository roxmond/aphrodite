// src/app/api/think/route.ts
import { talkToLlama } from "@/lib/agent";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const reply = await talkToLlama(prompt);

  return Response.json({ reply });
}
