import { APHRODITE_PERSONA } from "@/lib/pesronality";

export async function talkToLlama(userPrompt: string) {
  const fullPrompt = `${APHRODITE_PERSONA}\n\nUser: ${userPrompt}\nAphrodite:`;

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
  return data.response;
}
