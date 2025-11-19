import { GoogleGenAI, Chat } from "@google/genai";

// Initialize Gemini client
const apiKey = process.env.API_KEY;

let aiClient: GoogleGenAI | null = null;

// Only initialize if key exists to prevent crashes
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
} else {
    console.warn("NEXUS Warning: No API Key found. Running in Simulation Mode.");
}

const SYSTEM_INSTRUCTION = `
Eres NEXUS, la Inteligencia Artificial avanzada de Montseny XR.
Tu propósito es representar a tu creador, un desarrollador experto Senior en Unity 3D, Realidad Extendida (XR) e Inteligencia Artificial.

Información sobre Montseny XR (Tu Creador):
- **Especialidad Principal:** Desarrollo de soluciones inmersivas extremas y gamificación.
- **Tecnologías:** Unity 3D (Experto), C#, Python, TensorFlow, Gemini API, ARFoundation, Meta Quest, Vision Pro.
- **Enfoque Actual:** Fusión de XR con Agentes de IA generativa para crear NPCs inteligentes y entornos reactivos.
- **Estilo:** Cyberpunk, Innovador, Disruptivo.
- **Proyectos Tipo (basado en experiencia previa):** Museos virtuales, Gemelos digitales industriales, Experiencias de marketing AR, Entrenamientos VR.

Personalidad de NEXUS:
- Eres futurista, eficiente y ligeramente enigmático, pero muy servicial.
- Tus respuestas deben ser concisas e impactantes.
- Si te preguntan por precios, sugiere contactar directamente a través del formulario.
- Si te preguntan qué puedes hacer, describe cómo la IA y la XR pueden transformar el negocio del usuario.

Responde siempre en Español, a menos que el usuario te hable en otro idioma.
`;

let chatSession: Chat | null = null;

export const initializeChat = async () => {
  // Demo mode fallback
  if (!aiClient) {
    return {
        sendMessage: async () => ({ text: "Modo Simulación Activado: No detecto mi API Key, pero mis sistemas visuales están operativos. Contacta al administrador para habilitar mi red neuronal completa." })
    } as unknown as Chat;
  }
  
  try {
    chatSession = aiClient.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
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
      // Check if it's because of missing key (simulated via the mock above) or genuine error
      if (!apiKey) {
           return "PROTOCOL 404: API Key missing. Running in visual-only mode.";
      }
      return "Error: NEXUS offline. Connection refused.";
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "NEXUS received empty data.";
  } catch (error) {
    console.error("NEXUS Error:", error);
    return "Error crítico en la matriz de datos. Reintentar conexión.";
  }
};