import { APHRODITE_PERSONA } from "@/lib/pesronality";
import { APHRODITE_GOAL } from "@/lib/goal";
import { loadMemory, addMemory } from "./memory";

export async function talkToLlama(userPrompt: string) {
  const memory = loadMemory();

  let memoryContext = "";
  if (memory.length > 0) {
    const recentMemory = memory.slice(-3).reverse();
    memoryContext = recentMemory
      .map(
        (entry) => `User: ${entry.userPrompt}\nAphrodite: ${entry.aiResponse}\n`
      )
      .join("\n");
  }
  const fullPrompt = `
${APHRODITE_PERSONA}
${APHRODITE_GOAL}

Παρακαλώ να απαντάς **μόνο στα Ελληνικά** και μόνο σύντομες απαντήσεις.

Recent Conversations:
${memoryContext}

User: ${userPrompt}
Aphrodite:
`.trim();

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3",
      prompt: fullPrompt,
      stream: false,
    }),
  });

  const data = await response.json();
  const aiResponse = data.response;

  // Save the new memory
  addMemory(userPrompt, aiResponse);

  return aiResponse;
}
