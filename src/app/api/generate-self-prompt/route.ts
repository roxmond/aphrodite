import { loadMemory } from "@/lib/memory";
import { talkToLlama } from "@/lib/agent";

export async function POST() {
  const memory = await loadMemory();
  const summary = memory
    .map((m) => `Prompt: ${m.userPrompt}\nReply: ${m.aiResponse}`)
    .join("\n\n");

  const prompt = `Based on the following memory, what should be the AI's next goal or prompt?\n\n${summary}\n\nReturn only the prompt to ask next.`;
  const suggestion = await talkToLlama(prompt);

  return Response.json({ prompt: suggestion });
}
