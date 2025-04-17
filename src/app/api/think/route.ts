import { talkToLlama } from "@/lib/agent";
//import { addMemory } from "@/lib/memory";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const reply = await talkToLlama(prompt);

  //addMemory(prompt, reply); // using the correct function from memory.ts

  return Response.json({ reply });
}
