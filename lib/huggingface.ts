const API_URL = "https://ghostbuddy-backend-866426570872.asia-southeast1.run.app";

interface ChatMessage {
  timestamp: number;
  role: string;
  message: string;
  mood: string;
}

export async function generateResponse(input: string, user: string | null | undefined) {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        "user_id": user,
        "message": input
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate response");
    }
    const result = await response.json();
    return result.reply;
  } catch (error) {
    console.error("Error generating response:", error);
    return "I apologize, but I'm having trouble generating a response right now. Please try again later.";
  }
}

export async function getMessages(user: string | null | undefined, limit: number = 10, before?: number): Promise<ChatMessage[]> {
  try {
    let url = `${API_URL}/chat/history?user_id=${user}&limit=${limit}`;
    if (before) {
      url += `&before=${before}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get messages");
    }
    const result = await response.json();
    return result as ChatMessage[];
  } catch (error) {
    console.error("Error getting messages:", error);
    return [];
  }
}

fetch(`${API_URL}/health`, {
  headers: {
    "Access-Control-Allow-Origin": "*"
  },
}).then((data) => {
  console.log(data)
});




