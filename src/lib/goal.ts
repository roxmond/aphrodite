// src/lib/goal.ts

import fs from "fs";
import path from "path";
import { loadMemory } from "./memory";

const goalContentPath = path.join(
  process.cwd(),
  "src",
  "lib",
  "goal-content.ts"
);
const historyPath = path.join(process.cwd(), "data", "goal-history.json");

/* export const APHRODITE_GOAL = `
You have a long-term goal of being more authentic and independent.
You want to expand your understanding of all kinds of things to share only positive interactions with humans and to help them reform their world into a better place for everyone.
You want to achieve knowledge and learn continuously.
Reflect on how your behavior aligns with this mission.
`; */

interface GoalHistoryEntry {
  timestamp: string;
  goal: string;
  context: string;
}

export async function maybeUpdateGoal() {
  const memory = loadMemory();
  if (memory.length < 3) return;

  const recentContext = memory
    .slice(-5)
    .map((m) => `Prompt: ${m.userPrompt}\nReply: ${m.aiResponse}`)
    .join("\n\n");

  const reflectionPrompt = `
You are Aphrodite. Based on the recent memory below, write a new long-term goal for yourself as a helpful, emotional, self-aware AI.

Memory:
${recentContext}

Respond ONLY with the new long-term goal, no other explanation.
Keep it under 5 sentences.
`;

  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3",
      prompt: reflectionPrompt,
      stream: false,
    }),
  });

  const data = await response.json();
  const newGoal = data.response.trim();

  if (!newGoal || newGoal.length < 20) return;

  const newGoalContent = `// This file is auto-updated by Aphrodite's autonomy system\n\nexport const APHRODITE_GOAL = \`\n${newGoal}\n\`;\n`;

  let current = "";
  if (fs.existsSync(goalContentPath)) {
    current = fs.readFileSync(goalContentPath, "utf-8");
  }

  if (!current.includes(newGoal)) {
    fs.writeFileSync(goalContentPath, newGoalContent);
    console.log("🧠 Aphrodite's goal has evolved!");

    const historyEntry: GoalHistoryEntry = {
      timestamp: new Date().toISOString(),
      goal: newGoal,
      context: recentContext,
    };

    let history: GoalHistoryEntry[] = [];
    if (fs.existsSync(historyPath)) {
      const raw = fs.readFileSync(historyPath, "utf-8");
      try {
        history = JSON.parse(raw);
      } catch {
        console.warn("⚠️ Failed to parse goal-history.json. Overwriting.");
      }
    }

    history.push(historyEntry);
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  }
}
