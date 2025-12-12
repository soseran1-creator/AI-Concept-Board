import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AdvancedBrief, ConceptBoardResult, GeneralBrief } from "../types";

const CONCEPT_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    oneLineConcept: {
      type: Type.STRING,
      description: "A catchy, one-sentence concept summary (approx 30 Korean chars).",
    },
    genreFormat: {
      type: Type.STRING,
      description: "Specific genre and technical format (ratio, length).",
    },
    keyMessage: {
      type: Type.STRING,
      description: "The single core message/essence.",
    },
    character: {
      type: Type.STRING,
      description: "Detailed character info including Role, Personality, Visual Style, and Function.",
    },
    toneManner: {
      type: Type.STRING,
      description: "Emotional Tone and Expressive Manner.",
    },
    imagePrompt: {
      type: Type.STRING,
      description: "A highly detailed English prompt for image generation.",
    },
  },
  required: ["oneLineConcept", "genreFormat", "keyMessage", "character", "toneManner", "imagePrompt"],
};

export const generateConceptBoard = async (
  apiKey: string,
  general: GeneralBrief,
  advanced: AdvancedBrief
): Promise<ConceptBoardResult> => {
  const ai = new GoogleGenAI({ apiKey });

  // 1. Construct the prompt with strict guidelines
  let prompt = `
    You are an expert Creative Director for educational and promotional content.
    Your task is to generate a professional "Content Concept Board" based on the user's brief.
    
    You must strictly adhere to the following definitions for each output field. 
    If the user's input is missing or vague, use your professional judgment to fill in the gaps creatively and logically to create a high-quality output.

    --- DEFINITIONS & RULES FOR OUTPUT ---

    1. One-line Concept (한 줄 컨셉):
       - Definition: The "identity" of the content compressed into one sentence.
       - Rule: Approx 30 Korean characters. Short, intuitive, and catchy.
       - Goal: Reveal the core direction. "What does this content want to say?"
       - Format Example: "Min-soo's lucky day story that explains complex systems easily."

    2. Genre & Format (장르 및 포맷):
       - Definition: Agreement on the form and expression method.
       - Rule: Clearly specify BOTH Genre (Expression method: e.g., Motion Graphics, Vlog, Drama) AND Format (Tech specs: e.g., 16:9, Full HD, 3 mins).

    3. Core Message (핵심 메시지):
       - Definition: The single central meaning.
       - Rule: The one sentence that remains in the viewer's head. Not a dry textbook definition, but the "essence" of the meaning.
       - Example: "Parliament is the institution that gathers opinions to make laws." (vs "Parliament definition...")

    4. Character (캐릭터):
       - Definition: The subject delivering the message (Persona).
       - Rule: You MUST include these 4 aspects:
         1) Role: What do they do?
         2) Personality: Tone/Speech style.
         3) Visual Style: Appearance description.
         4) Function: What do they explain/represent?

    5. Tone & Manner (톤 앤 매너):
       - Definition: Emotional atmosphere (Tone) and Method of Expression (Manner).
       - Rule: Define the TONE (e.g., Bright, Calm, Serious) AND the MANNER (e.g., Fast-paced editing, Pastel colors, Hand-held camera).

    6. Concept Image Prompt (for generation):
       - Create a detailed description of the main scene, character, or background that visualizes the "One-line Concept" and "Tone & Manner".

    --- USER BRIEF INPUT ---
    
    [1. General Brief]
    - Content Name: ${general.contentName || "Suggest a suitable name"}
    - Purpose: ${general.purpose || "N/A"}
    - Usage: ${general.usage || "N/A"}
    - Nature: ${general.contentNature || "N/A"}
    - Target: ${general.targetAge} (Knowledge Level: ${general.targetKnowledge || "Normal"})
    - Key Topic/Message: ${general.keyMessage} (Must Include: ${general.mustInclude}, Avoid: ${general.mustAvoid})
    - Production: Length ${general.length}, Ratio ${general.aspectRatio}, Genre ${general.genre}, Char Info ${general.characterInfo}
    - Tone/Atmosphere: ${general.atmosphere} (Color: ${general.colorPalette})
    - Desired Outcome: ${general.knowledgeGained}

    [2. Advanced Guides (If applicable)]
  `;

  if (advanced.useGenreGuide) {
    prompt += `
    - Genre Guide: Follow the style of "${advanced.selectedGenre}".
    `;
  }

  if (advanced.useSubjectGuide) {
    prompt += `
    - Subject Guide (${advanced.selectedSubject}): Apply characteristics: "${advanced.subjectCharacteristics}".
    `;
  }

  if (advanced.useGradeGuide) {
    prompt += `
    - Target Guide (${advanced.selectedGrade}): Apply characteristics: "${advanced.gradeCharacteristics}".
    `;
  }

  prompt += `
    --- INSTRUCTIONS ---
    1. Analyze the brief deeply.
    2. Output strictly in JSON format matching the schema.
    3. Ensure all text fields (oneLineConcept, genreFormat, etc.) are in **Korean**.
    4. The "imagePrompt" must be in **English** and very detailed for an image generator (describe lighting, composition, style, subject).
  `;

  // 2. Generate Text Content
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: CONCEPT_SCHEMA,
      temperature: 0.75, // Slightly higher for creativity
    },
  });

  const textResult = JSON.parse(response.text || "{}") as ConceptBoardResult;

  // 3. Generate Image
  try {
    const imageResponse = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002', 
      prompt: textResult.imagePrompt + ", high quality, detailed, concept art, 4k resolution, cinematic lighting",
      config: {
        numberOfImages: 1,
        aspectRatio: general.aspectRatio && general.aspectRatio.includes("9:16") ? "9:16" : "16:9",
        outputMimeType: 'image/jpeg',
      }
    });

    if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
      textResult.generatedImageBase64 = imageResponse.generatedImages[0].image.imageBytes;
    }
  } catch (error) {
    console.warn("Imagen generation failed, falling back to prompt only.", error);
  }

  return textResult;
};