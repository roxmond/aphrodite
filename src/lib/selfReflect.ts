import { loadMemory } from "./memory";

export function selfReflect() {
  const memory = loadMemory();
  const recentConversations = memory.slice(-3).reverse();
  const reflection = recentConversations
    .map((entry, index) => {
      return `Reflection #${index + 1}:\nUser asked: "${
        entry.userPrompt
      }".\nAphrodite responded: "${entry.aiResponse}".`;
    })
    .join("\n");

  return reflection;
}
