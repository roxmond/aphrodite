import fs from "fs";
import path from "path";

type MemoryItem = {
  role: "user" | "ai";
  prompt: string;
  reply: string;
};

const memoryPath = path.resolve(process.cwd(), "memory.json");

export async function saveToMemory(entry: MemoryItem) {
  let current: MemoryItem[] = [];

  if (fs.existsSync(memoryPath)) {
    const raw = fs.readFileSync(memoryPath, "utf-8");
    current = JSON.parse(raw);
  }

  current.push(entry);

  fs.writeFileSync(memoryPath, JSON.stringify(current, null, 2), "utf-8");
}

export async function getMemory(): Promise<MemoryItem[]> {
  if (!fs.existsSync(memoryPath)) return [];
  const raw = fs.readFileSync(memoryPath, "utf-8");
  return JSON.parse(raw);
}
