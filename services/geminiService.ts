import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    // In a real app, you'd want to handle this more gracefully.
    // For this example, we'll throw an error to make it clear.
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

/**
 * Generates an image based on a text prompt using the Gemini API.
 * @param prompt The text prompt to generate an image from.
 * @param aspectRatio The desired aspect ratio for the image.
 * @returns A promise that resolves to an array of base64 data URLs of the generated images.
 */
export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string[]> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001', // High-quality model for stunning visuals
        prompt: prompt,
        config: {
          numberOfImages: 4,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio,
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
    } else {
      throw new Error("Image generation failed: No images were returned.");
    }
  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    // Provide a more user-friendly error message
    if (error instanceof Error && error.message.includes('API key not valid')) {
        throw new Error("The provided API key is not valid. Please check your configuration.");
    }
    throw new Error("Failed to generate image. The model may have refused the request.");
  }
};