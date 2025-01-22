const API_URL = "https://ghostbuddy-backend-866426570872.asia-southeast1.run.app";

export async function generateResponse(input: string, user: string | null | undefined) {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // add Access-Control-Allow-Origin
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        "user_id": user,   // Unique identifier for the user
        "message": input  // The user's text message to Ghost Buddy
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

export async function getMessages(user: string | null | undefined) {
  try {
    const response = await fetch(`${API_URL}/chat/history?user_id=${user}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // add Access-Control-Allow-Origin
        "Access-Control-Allow-Origin": "*"
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get messages");
    }
    const result = await response.json();
    return result;
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
})




