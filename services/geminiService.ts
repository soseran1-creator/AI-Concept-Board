import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AdvancedBrief, ConceptBoardResult, GeneralBrief } from "../types";

const CONCEPT_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    oneLineConcept: {
      type: Type.STRING,
      description: "A catchy, one-sentence concept summary.",
    },
    genreFormat: {
      type: Type.STRING,
      description: "The specific genre and format decided based on constraints.",
    },
    keyMessage: {
      type: Type.STRING,
      description: "The core message to be delivered.",
    },
    character: {
      type: Type.STRING,
      description: "Description of main characters or persona (visuals, personality).",
    },
    toneManner: {
      type: Type.STRING,
      description: "The visual and emotional tone (e.g., Bright, Educational, Serious).",
    },
    imagePrompt: {
      type: Type.STRING,
      description: "A detailed English prompt to generate a concept image representing this board.",
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

  // 1. Construct the prompt
  let prompt = `
    You are an expert Creative Director for educational and promotional content.
    Create a "Content Concept Board" based on the following user brief.
    
    --- GENERAL BRIEF ---
    1. Content Overview
    - Content Name: ${general.contentName || "N/A"}
    - Request Dept/Manager: ${general.requestDept || "N/A"}
    - Purpose: ${general.purpose || "N/A"}
    - Usage Platform: ${general.usage || "N/A"}
    - Nature/Style: ${general.contentNature || "N/A"}

    2. Target Info
    - Target Age/Level: ${general.targetAge || "N/A"}
    - Target's Prior Knowledge: ${general.targetKnowledge || "N/A"}

    3. Key Topic
    - Key Message: ${general.keyMessage || "N/A"}
    - Must Include: ${general.mustInclude || "N/A"}
    - Must Avoid: ${general.mustAvoid || "N/A"}

    4. Production Conditions
    - Length: ${general.length || "N/A"}
    - Aspect Ratio: ${general.aspectRatio || "N/A"}
    - Production Genre/Format: ${general.genre || "N/A"}
    - Character Info: ${general.characterInfo || "N/A"}
    - Budget/Difficulty: ${general.budgetDifficulty || "N/A"}

    5. Tone & Manner
    - Atmosphere: ${general.atmosphere || "N/A"}
    - References (Img/Link): ${general.refLink || "N/A"}
    - Similar Work Refs: ${general.similarLink || "N/A"}
    - Planner's Ref Video: ${general.plannerRefLink || "N/A"}
    - Color Palette: ${general.colorPalette || "N/A"}

    6. Desired Outcome
    - Knowledge Gained: ${general.knowledgeGained || "N/A"}
  `;

  if (advanced.useGenreGuide) {
    prompt += `
    --- GENRE GUIDE ---
    Strictly follow the style of: ${advanced.selectedGenre}
    `;
  }

  if (advanced.useSubjectGuide) {
    prompt += `
    --- SUBJECT GUIDE (${advanced.selectedSubject}) ---
    Apply these subject-specific characteristics: ${advanced.subjectCharacteristics}
    `;
  }

  if (advanced.useGradeGuide) {
    prompt += `
    --- TARGET/GRADE GUIDE (${advanced.selectedGrade}) ---
    Apply these target-specific characteristics: ${advanced.gradeCharacteristics}
    `;
  }

  prompt += `
    --- INSTRUCTIONS ---
    Analyze the brief deeply. If information is missing, infer the best creative direction based on the available context.
    Output the result in JSON format matching the schema.
    
    - "oneLineConcept": Creative summary.
    - "genreFormat": Specific format details.
    - "keyMessage": Core message refined.
    - "character": Detailed character description.
    - "toneManner": Atmosphere description.
    - "imagePrompt": A HIGHLY DETAILED English prompt for an AI image generator to visualize the concept. Describe lighting, style (e.g., 3D render, flat illustration), colors, and composition.

    All fields (except imagePrompt) should be in Korean.
  `;

  // 2. Generate Text Content
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: CONCEPT_SCHEMA,
      temperature: 0.7,
    },
  });

  const textResult = JSON.parse(response.text || "{}") as ConceptBoardResult;

  // 3. Generate Image
  try {
    const imageResponse = await ai.models.generateImages({
      model: 'imagen-3.0-generate-002', 
      prompt: textResult.imagePrompt + ", high quality, detailed, concept art style",
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