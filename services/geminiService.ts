import { GoogleGenAI, Modality } from "@google/genai";
import { BrainCycleResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- MATH UTILS ---
const magnitude = (v: number[]) => Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
const cosineSimilarity = (a: number[], b: number[]) => {
  const magA = magnitude(a);
  const magB = magnitude(b);
  if (magA === 0 || magB === 0) return 0;
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  return dot / (magA * magB);
};

export const runBrainCycle = async (
  imageBase64: string, 
  currentBeliefState: number[], 
  alpha: number
): Promise<BrainCycleResult> => {
  try {
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    
    // Active Inference Prompt
    const prompt = `
      Act as a Computational Brain Simulation (Active Inference Engine).
      Analyze the input image.

      1. **Feature Extraction (Bottom-Up)**:
         - Generate a 4D feature vector [Complexity, Brightness, Motion, Familiarity] (0.0-1.0).
         - Identify V1 features (edges, contrast) and IT object recognition.

      2. **Prediction Generation (Top-Down)**:
         - Based on standard priors, what did you expect? 
         - Generate a "Predicted Vector" representing this expectation.

      3. **Motor Cortex Planning**:
         - Determine the single most logical physical response based on the belief state.
         - Format: "Action description" (e.g., "Grasp object", "Scan face", "Recoil").

      4. **Conscious Narrative (First-Person)**:
         - STRICT FORMAT: 3-4 sentences max.
         - Mention: Bottom-up input, Top-down prior, Surprise level, and Motor readiness.
         - Style: "Received bottom-up stream... Strong top-down prior... Surprise level X... Motor Cortex preparing Y."

      Return JSON:
      {
        "sensoryVector": [0.8, 0.9, 0.1, 0.5],
        "predictionVector": [0.7, 0.9, 0.0, 0.6],
        "v1": { "edges": "Sharp/High-Freq", "contrast": 0.9, "motion": "Static" },
        "it": { "objectLabel": "Coffee Mug", "category": "Artifact", "confidence": 0.95 },
        "pfc": { "prediction": "Expect office stationary object", "context": "Work environment" },
        "motor": { "action": "Reach and Grasp", "target": "Handle", "confidence": 0.88, "reasoning": "Object affords grasping" },
        "activations": { "v1": 85, "it": 92, "pfc": 60, "motor": 45 },
        "narrative": "Received bottom-up stream: distinct shape with high contrast. Top-down prior predicted office context. Low surprise (0.12). Belief confirmed. Motor Cortex preparing grasp action."
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: {
        parts: [
            { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
            { text: prompt }
        ]
      },
      config: { responseMimeType: 'application/json', temperature: 0.3 }
    });

    let text = response.text || "{}";
    text = text.replace(/```json|```/g, "").trim();
    const rawData = JSON.parse(text);

    // --- COMPUTATION ---
    const sensoryVec = rawData.sensoryVector || [0.5, 0.5, 0.5, 0.5];
    const predVec = rawData.predictionVector || [0.5, 0.5, 0.5, 0.5];

    // 1. Surprise = 1 - Cosine Similarity
    const similarity = cosineSimilarity(sensoryVec, predVec);
    const predictionError = 1 - similarity;

    // 2. Belief Update: Belief = (Belief * 0.7) + (Input * 0.3)
    // We update the persistent belief state with the new sensory evidence
    const newBeliefState = currentBeliefState.map((b, i) => 
        (b * 0.7) + (sensoryVec[i] * 0.3)
    );
    
    const beliefUpdateDelta = magnitude(newBeliefState.map((v, i) => v - currentBeliefState[i]));

    // 3. Firing Rate Simulation (Hz)
    // Base 10Hz + Activation + Surprise Spike
    const avgAct = (rawData.activations.v1 + rawData.activations.it + rawData.activations.pfc) / 3;
    const firingRate = 10 + (avgAct * 0.5) + (predictionError * 120); // Big spike on error

    return {
      bottomUp: {
        v1: rawData.v1,
        it: rawData.it,
        featureVector: sensoryVec
      },
      topDown: {
        pfc: rawData.pfc,
        predictedVector: predVec
      },
      motor: rawData.motor,
      activations: rawData.activations,
      conscious: {
        narrative: rawData.narrative,
        surpriseFactor: predictionError,
        firingRate: Math.round(firingRate)
      },
      metrics: {
        predictionError,
        cosineSimilarity: similarity,
        beliefUpdateDelta
      },
      newBeliefState
    };

  } catch (error) {
    console.error("Simulation Error:", error);
    throw error;
  }
};

export const generateVoice = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!audioData) throw new Error("No audio data");
        return audioData;
    } catch (error) {
        console.error("TTS Error:", error);
        throw error;
    }
}