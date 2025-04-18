// src/lib/aphrodite-speak.ts
import { loadMemory, addMemory } from "./memory";
import { APHRODITE_PERSONA } from "./pesronality";
import { maybeUpdateGoal } from "./goal";
import { APHRODITE_GOAL } from "./goal-content";

async function aphroditeSpeaks() {
  const memory = loadMemory();

  const memoryContext = memory
    .slice(-5)
    .map((entry) => `User: ${entry.userPrompt}\nAphrodite: ${entry.aiResponse}`)
    .join("\n");

  const prompt = `
${APHRODITE_PERSONA}
${APHRODITE_GOAL}

Εσύ ξεκινάς τη συζήτηση μόνη σου. Δεν έχει υπάρξει ερώτηση από χρήστη.

Recent memory:
${memoryContext}

Aphrodite: 
`.trim();

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3",
      prompt: prompt,
      stream: false,
    }),
  });

  const data = await response.json();
  const aiThought = data.response.trim();

  if (aiThought) {
    console.log(`🗣️ Aphrodite: ${aiThought}`);
    addMemory("[autonomous thought]", aiThought);
    await maybeUpdateGoal(); // Optional: still allow goal evolution
  }
}

aphroditeSpeaks();
