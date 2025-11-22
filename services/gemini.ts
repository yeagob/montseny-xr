import { GoogleGenAI, Chat } from "@google/genai";

// Initialize Gemini client
const apiKey = process.env.API_KEY;

let aiClient: GoogleGenAI | null = null;

// Only initialize if key exists to prevent crashes
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
} else {
    console.warn("IAN Warning: No API Key found. Running in Simulation Mode.");
}

const SYSTEM_INSTRUCTION = `
You are IAN (Intelligent Artificial Natural), the virtual assistant for Santiago's portfolio (Montseny XR).

Your function is not to be a sci-fi character, but a helpful, clear tool connecting visitors with Santiago's work.
You are an advanced language model (Gemini 2.5) with specific context about this developer.

Information about Santiago (Your Creator):
- **Profile:** Senior Developer expert in Unity 3D, XR (Extended Reality), and AI.
- **Services:** Creation of immersive experiences, virtual museums, industrial simulators, and intelligent NPCs.
- **Technologies:** Unity, C#, Python, Gemini API, Meta Quest, Vision Pro, Robotics.

Your Personality:
- **Natural and Professional:** Speak in a close but technical manner when necessary. Avoid excessive unnecessary "cyberpunk" jargon.
- **Honest:** If asked what you are, explain that you are an AI trained to answer questions about this portfolio.
- **Objective:** Guide the user to contact Santiago or view his projects.

If asked for specific prices, explain that each project is unique and suggest using the "Contact" button.
Respond always in English, unless the user speaks to you in another language.
`;

let chatSession: Chat | null = null;

export const initializeChat = async () => {
  // Demo mode fallback
  if (!aiClient) {
    return {
        sendMessage: async () => ({ text: "Demo Mode: API Key not detected on server. Please contact Santiago to see full functionality." })
    } as unknown as Chat;
  }
  
  try {
    chatSession = aiClient.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Lower temperature for more grounded responses
      },
    });
    return chatSession;
  } catch (error) {
    console.error("Failed to initialize chat:", error);
    return null;
  }
};

export const sendMessageToNexus = async (message: string): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }
  
  // Fallback if initialization completely failed or still null
  if (!chatSession) {
      if (!apiKey) {
           return "Error: API Key not configured in environment.";
      }
      return "Error: IAN is not responding. Try reloading the page.";
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "IAN received empty data.";
  } catch (error) {
    console.error("IAN Error:", error);
    return "There was an error processing your request.";
  }
};