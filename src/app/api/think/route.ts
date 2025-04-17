import { talkToLlama } from "@/lib/agent";
import { saveToMemory } from "@/lib/memory";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const reply = await talkToLlama(prompt);

  await saveToMemory({
    role: "user",
    prompt,
    reply,
  });

  return Response.json({ reply });
}
