import { UserPreferences, GroundingChunk } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeClothingImage = async (base64Image: string): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Analyze this wardrobe image in detail',
        image_url: base64Image
      })
    });
    const data = await response.json();
    const visionResponse = data.responses?.find((r: any) => r.agent === 'VisionAgent');
    return visionResponse?.message || "Could not analyze image.";
  } catch (error) {
    console.error("Vision Agent Error:", error);
    return "Error analyzing the clothing image.";
  }
};

export const analyzeUserIntent = async (prefs: UserPreferences): Promise<string> => {
  try {
    const message = `Analyze my style intent: I'm going to a ${prefs.event}, want to be perceived as ${prefs.presentation}, feeling ${prefs.mood}, weather is ${prefs.weather}, budget ${prefs.budget}, prefer colors that ${prefs.colorPreference}. What's my style strategy?`;
    
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    const intentResponse = data.responses?.[0];
    return intentResponse?.message || "Could not determine intent.";
  } catch (error) {
    console.error("Intent Agent Error:", error);
    return "Error analyzing user intent.";
  }
};

export const generateRecommendations = async (
  visionAnalysis: string,
  intentAnalysis: string
): Promise<{ text: string; chunks: GroundingChunk[] }> => {
  try {
    const message = `Recommend a complete outfit. My wardrobe: ${visionAnalysis.substring(0, 200)}. My needs: ${intentAnalysis.substring(0, 200)}. Give me specific recommendations.`;
    
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    const recResponse = data.responses?.find((r: any) => r.agent === 'RecommendationAgent');
    return { 
      text: recResponse?.message || "No recommendations generated.",
      chunks: []
    };
  } catch (error) {
    console.error("Recommendation Agent Error:", error);
    return { text: "Error fetching recommendations.", chunks: [] };
  }
};

export const generateOutfitVisual = async (description: string): Promise<string | null> => {
  try {
    const message = `Generate a visual image of this outfit: ${description.substring(0, 300)}`;
    
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    const imageResponse = data.responses?.find((r: any) => r.agent === 'ImageGenAgent');
    return imageResponse?.image_base64 || null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};
