import fs from "fs";
import path from "path";

// Define where the memory is stored
const memoryPath = path.join(process.cwd(), "data", "memory.json");

interface MemoryEntry {
  timestamp: string;
  userPrompt: string;
  aiResponse: string;
  mood?: string;
  topics?: string[];
}

// Check if memory file exists
export function loadMemory(): MemoryEntry[] {
  if (fs.existsSync(memoryPath)) {
    const raw = fs.readFileSync(memoryPath, "utf-8");
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Error reading memory:", e);
      return [];
    }
  }
  return [];
}

// Save memory entry
export function saveMemory(entry: MemoryEntry) {
  const memory = loadMemory();
  memory.push(entry);
  fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));
}

// Update memory with new conversation
export function addMemory(
  userPrompt: string,
  aiResponse: string,
  mood?: string,
  topics?: string[]
) {
  const entry: MemoryEntry = {
    timestamp: new Date().toISOString(),
    userPrompt,
    aiResponse,
    mood,
    topics,
  };
  saveMemory(entry);
}
