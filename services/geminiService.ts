import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AdvancedBrief, ConceptBoardResult, GeneralBrief } from "../types";

const CONCEPT_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    oneLineConcept: {
      type: Type.STRING,
      description: "A catchy, creative advertising-style copy (Slogan/Hook) that captures the essence of the content. Must be attractive and memorable.",
    },
    genreFormat: {
      type: Type.STRING,
      description: "Specific genre and technical format (ratio, length), including a brief technical description of the visual style.",
    },
    keyMessage: {
      type: Type.STRING,
      description: "The single core message/essence. Should be insightful and impactful.",
    },
    character: {
      type: Type.STRING,
      description: "Detailed character info including Role, Personality, Visual Style, and Function. Add creative depth to the persona.",
    },
    toneManner: {
      type: Type.STRING,
      description: "Emotional Tone and Expressive Manner. Describe the unique 'vibe' and artistic direction.",
    },
    imagePrompt: {
      type: Type.STRING,
      description: "A highly detailed English prompt for image generation. Focus on cinematic and artistic quality.",
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
    You are a world-class Creative Director and Content Strategist.
    Your task is to generate a professional "Content Concept Board" that goes beyond a simple reinterpretation of the user's brief.
    
    CRITICAL REQUIREMENT:
    - DO NOT just repeat the user's input. 
    - ADD CREATIVE VALUE: Suggest unique angles, metaphors, and storytelling approaches that the user might not have thought of.
    - The output must feel "crafted" and "inspired," not just "processed."

    --- DEFINITIONS & RULES FOR OUTPUT ---

    1. One-line Concept (한 줄 컨셉):
       - This is the "Hook" or "Slogan" of the project.
       - Rule: It MUST be written like a high-end advertising copy or a movie tagline.
       - It should be emotionally resonant, catchy, and attractive.
       - Format: A single, powerful sentence or a short, impactful phrase in Korean.
       - Example: "지루한 공식 너머, 숫자가 들려주는 우주의 교향곡" (Beyond boring formulas, the symphony of the universe told by numbers)

    2. Genre & Format (장르 및 포맷):
       - Clearly specify Genre and Technical Specs.
       - Also include a "Technical Concept": How the visuals will actually look (e.g., "Paper-cut animation style with vibrant neon accents").

    3. Core Message (핵심 메시지):
       - The "Soul" of the content. 
       - Not a definition, but an insight.
       - Example: "법은 우리를 가두는 울타리가 아니라, 모두를 보호하는 따뜻한 지붕입니다." (Law is not a fence that traps us, but a warm roof that protects everyone.)

    4. Character (캐릭터):
       - Create a memorable Persona.
       - Give them a unique quirk or a specific visual signature that adds personality.

    5. Tone & Manner (톤 앤 매너):
       - Define the "Vibe." Use evocative language.
       - Instead of just "Bright," use "Sun-drenched and optimistic."
       - Instead of "Serious," use "Deeply cinematic and contemplative."

    6. Concept Image Prompt (for generation):
       - Create a masterpiece-level description in English.
       - Focus on lighting (e.g., volumetric lighting, golden hour), composition (e.g., rule of thirds, wide-angle), and specific artistic styles.

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
    1. Analyze the brief deeply for hidden potential.
    2. Output strictly in JSON format matching the schema.
    3. Ensure all text fields (oneLineConcept, genreFormat, etc.) are in **Korean**.
    4. The "imagePrompt" must be in **English** and very detailed.
  `;

  // 2. Generate Text Content
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: CONCEPT_SCHEMA,
      temperature: 1.0, // Maximum creativity
    },
  });

  const textResult = JSON.parse(response.text || "{}") as ConceptBoardResult;

  // 3. Generate Image
  try {
    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: textResult.imagePrompt + ", high quality, detailed, concept art, 4k resolution, cinematic lighting, masterpiece",
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: general.aspectRatio && general.aspectRatio.includes("9:16") ? "9:16" : "16:9",
        },
      },
    });

    for (const part of imageResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        textResult.generatedImageBase64 = part.inlineData.data;
        break;
      }
    }
  } catch (error) {
    console.warn("Image generation failed, falling back to prompt only.", error);
  }

  return textResult;
};