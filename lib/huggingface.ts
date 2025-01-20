const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/facebook/blenderbot-400m-distill";

let history = "";

export async function generateResponse(input: string) {
  const apiKey = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;

  if (!apiKey) {
    console.error("Missing Hugging Face API key");
    return "Configuration error: API key not found. Please check your environment variables.";
  }

  try {
    history += ` <s>${input}</s>`;
    const response = await fetch(HUGGING_FACE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ inputs: history }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate response");
    }
    const result = await response.json();
    history += ` <s>${result[0].generated_text}</s>`;
    return result[0].generated_text;
  } catch (error) {
    console.error("Error generating response:", error);
    return "I apologize, but I'm having trouble generating a response right now. Please try again later.";
  }
}


