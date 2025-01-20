const API_URL = "https://ghostbuddy-backend-866426570872.asia-southeast1.run.app";

export async function generateResponse(input: string, user: string | null | undefined) {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
        // add Access-Control-Allow-Origin
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

fetch(`${API_URL}/health`).then((data) => {
  console.log(data)
})




