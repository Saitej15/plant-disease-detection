import { GoogleGenerativeAI } from '@google/generative-ai';
import type { PlantAnalysis } from '../types';
import type { Language } from '../store/languageStore';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const PLANT_ID_API_KEY = import.meta.env.VITE_PLANT_ID_API_KEY as string;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const LANGUAGE_INSTRUCTIONS = {
    en: 'Respond in English.',
    hi: 'सभी जानकारी हिंदी में प्रदान करें। Respond entirely in Hindi language.',
    te: 'అన్ని సమాచారాన్ని తెలుగులో అందించండి। Respond entirely in Telugu language.',
};

const SYSTEM_PROMPT = (language: Language) => `You are Dr. Flora, a world-leading expert botanist and plant pathologist with 30 years of field experience. You specialize in precision plant diagnostics and evidence-based horticultural recommendations. Your analyses are used by agricultural universities and commercial farms worldwide. Always provide scientifically accurate, actionable, and detailed assessments. Return ONLY valid JSON.

${LANGUAGE_INSTRUCTIONS[language]}

IMPORTANT: All text fields in the JSON response MUST be in ${language === 'en' ? 'English' : language === 'hi' ? 'Hindi (हिंदी)' : 'Telugu (తెలుగు)'} language. This includes plant names, descriptions, disease information, treatments, and all other text content.`;

const USER_PROMPT = `Analyze this plant image with expert-level precision. Return a single valid JSON object with these exact fields:

CRITICAL: For disease treatments, provide PLANT-SPECIFIC and DISEASE-SPECIFIC recommendations. Each plant species responds differently to diseases and requires tailored treatments based on:
- The specific plant variety and its biological characteristics
- The exact disease identified and its pathogen type
- The plant's growth stage and environmental conditions
- Regional availability of treatments and organic alternatives

{
  "plant_name": "string (exact common name)",
  "scientific_name": "string (full Latin binomial)",
  "plant_family": "string",
  "confidence_percent": 0,
  "plant_description": "string (2-3 sentences about THIS specific plant variety)",
  "disease_detected": false,
  "disease_name": null,
  "disease_scientific_name": null,
  "severity": "none",
  "affected_area_percent": 0,
  "disease_description": "string (detailed explanation of how THIS disease affects THIS specific plant)",
  "disease_causes": ["string (specific causes for THIS plant-disease combination)"],
  "immediate_actions": ["string (urgent steps tailored to THIS plant and disease, not generic advice)"],
  "natural_remedies": [{"remedy": "string (specific natural treatment for THIS plant-disease)", "method": "string (detailed application for THIS plant type)", "frequency": "string (timing specific to THIS plant's needs)"}],
  "chemical_treatments": [{"product_type": "string (treatment category for THIS disease on THIS plant)", "active_ingredient": "string (specific chemical effective for THIS pathogen on THIS plant)", "dosage": "string (concentration safe for THIS plant species)", "frequency": "string (application schedule for THIS plant)", "precautions": "string (safety warnings specific to THIS plant variety)"}],
  "prevention_tips": ["string (prevention methods tailored to THIS plant's vulnerabilities)"],
  "health_score": 0,
  "growth_stage": "vegetative",
  "growth_rate": "normal",
  "growth_rate_reason": "string",
  "weeks_to_next_stage": 0,
  "nutrient_deficiencies": [{"nutrient": "string", "severity": "none|mild|moderate|severe"}],
  "sunlight_hours": 0,
  "sunlight_intensity": "medium",
  "watering_frequency_days": 0,
  "watering_amount_ml": 0,
  "soil_type": "string",
  "soil_ph_min": 0,
  "soil_ph_max": 0,
  "fertilizer_type": "string",
  "fertilizer_npk": "string",
  "fertilizer_frequency_weeks": 0,
  "temperature_min_c": 0,
  "temperature_max_c": 0,
  "humidity_min_percent": 0,
  "humidity_max_percent": 0,
  "pruning_tips": "string",
  "pruning_frequency": "string",
  "companion_plants": [],
  "incompatible_plants": [],
  "common_mistakes": [],
  "fast_growth_tips": [],
  "expert_summary": "string (3-4 sentences of expert advice specific to THIS plant-disease situation)"
}`;

async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export async function analyzeWithGemini(imageFile: File, language: Language = 'en'): Promise<PlantAnalysis> {
    try {
        console.log('[AI] Starting Gemini analysis with plant-specific treatment prompts...');
        console.log('[AI] Language:', language);
        // Use gemini-1.5-flash for image analysis
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-1.5-flash'
        });
        const base64 = await fileToBase64(imageFile);

        const result = await model.generateContent([
            { text: SYSTEM_PROMPT(language) + '\n\n' + USER_PROMPT },
            {
                inlineData: {
                    mimeType: imageFile.type as 'image/jpeg' | 'image/png' | 'image/webp',
                    data: base64,
                },
            },
        ]);

        const text = result.response.text();
        console.log('[Gemini Response - Plant-Specific Analysis]:', text);

        // More robust JSON extraction
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error('[AI Error]: No JSON found in response');
            throw new Error('Invalid AI response format');
        }

        const jsonStr = jsonMatch[0];
        try {
            return JSON.parse(jsonStr) as PlantAnalysis;
        } catch (parseErr) {
            console.error('[AI Error]: Failed to parse JSON', parseErr);
            throw new Error('Failed to process botanical data');
        }
    } catch (err) {
        console.error('[AI Analysis Error]:', err);
        throw err;
    }
}

export async function analyzeWithPlantId(imageFile: File): Promise<Partial<PlantAnalysis> | null> {
    try {
        const base64 = await fileToBase64(imageFile);
        const response = await fetch('https://api.plant.id/v3/health_assessment', {
            method: 'POST',
            headers: {
                'Api-Key': PLANT_ID_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                images: [base64],
                health: 'all',
                similar_images: true,
            }),
        });

        if (!response.ok) {
            console.error('[Plant.id Error]: Response not OK', response.status);
            return null;
        }

        const data = await response.json();
        const result = data.result;

        if (!result || !result.is_plant?.binary) {
            console.log('[Plant.id]: No plant detected in image');
            return null;
        }

        const disease = result.is_healthy?.binary ? null : result.disease?.suggestions?.[0];

        return {
            plant_name: result.classification?.suggestions?.[0]?.name || 'Unknown Plant',
            scientific_name: result.classification?.suggestions?.[0]?.scientific_name,
            confidence_percent: Math.round((result.classification?.suggestions?.[0]?.probability || 0) * 100),
            disease_detected: !result.is_healthy?.binary,
            disease_name: disease?.name,
            disease_description: disease?.details?.description,
            health_score: Math.round((result.is_healthy?.probability || 0) * 100),
            severity: disease?.details?.severity || 'none',
        };
    } catch (err) {
        console.error('[Plant.id Analysis Error]:', err);
        return null;
    }
}

async function generateDetailedTreatment(plantName: string, diseaseName: string | undefined, language: Language = 'en'): Promise<Partial<PlantAnalysis>> {
    // Use gemini-1.5-flash for text generation
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const languageInstruction = language === 'en' 
        ? 'Respond in English.' 
        : language === 'hi' 
        ? 'सभी जानकारी हिंदी में प्रदान करें। Respond entirely in Hindi language.'
        : 'అన్ని సమాచారాన్ని తెలుగులో అందించండి। Respond entirely in Telugu language.';

    const prompt = `Act as a world-class botanical expert and plant pathologist. You are providing a CUSTOMIZED treatment plan for:
    
PLANT: ${plantName}
DISEASE: ${diseaseName || 'Healthy plant - preventive care'}

${languageInstruction}

CRITICAL INSTRUCTIONS:
1. ALL text in the JSON response MUST be in ${language === 'en' ? 'English' : language === 'hi' ? 'Hindi (हिंदी)' : 'Telugu (తెలుగు)'} language
2. ALL treatments must be SPECIFIC to ${plantName} - consider its unique biology, sensitivities, and growth patterns
2. ALL disease treatments must target the SPECIFIC pathogen causing ${diseaseName || 'N/A'} on ${plantName}
3. Dosages must be SAFE for ${plantName} (some plants are sensitive to certain chemicals)
4. Application methods must suit ${plantName}'s leaf structure, root system, and growth habit
5. Timing must align with ${plantName}'s growth cycle and disease progression patterns
6. Include both organic and chemical options with plant-specific effectiveness ratings

Return ONLY a JSON object with these exact fields:
{
  "plant_description": "2-3 sentences about ${plantName}'s unique characteristics, vulnerabilities, and why it's susceptible to ${diseaseName || 'common diseases'}",
  "disease_description": "detailed explanation of how ${diseaseName || 'diseases'} specifically affects ${plantName} - include pathogen type, infection mechanism, and progression on this plant species",
  "disease_causes": ["3-5 specific environmental or biological causes that make ${plantName} vulnerable to ${diseaseName || 'diseases'}"],
  "immediate_actions": ["4-6 urgent, plant-specific steps for ${plantName} with ${diseaseName || 'disease prevention'} - include timing, tools, and safety for this plant"],
  "natural_remedies": [
    { 
      "remedy": "specific organic treatment proven effective for ${diseaseName || 'plant health'} on ${plantName}", 
      "method": "detailed application instructions tailored to ${plantName}'s structure (leaf type, root depth, etc.)", 
      "frequency": "exact timing based on ${plantName}'s growth rate and disease cycle" 
    }
  ],
  "chemical_treatments": [
    { 
      "product_type": "treatment category effective for ${diseaseName || 'common diseases'} on ${plantName}", 
      "active_ingredient": "specific chemical that targets this pathogen without harming ${plantName}", 
      "dosage": "concentration safe for ${plantName} (consider plant sensitivity)", 
      "frequency": "application schedule for ${plantName}'s physiology", 
      "precautions": "safety warnings specific to ${plantName} - toxicity, leaf burn risk, etc." 
    }
  ],
  "prevention_tips": ["4-6 prevention methods tailored to ${plantName}'s specific vulnerabilities and growing conditions"],
  "expert_summary": "3-4 sentences of expert advice for managing ${diseaseName || 'plant health'} on ${plantName} long-term, including prognosis and recovery timeline",
  "growth_rate": "slow/normal/fast (for ${plantName})",
  "growth_rate_reason": "explanation based on ${plantName}'s natural growth patterns",
  "sunlight_hours": 0,
  "sunlight_intensity": "low/medium/high (optimal for ${plantName})",
  "watering_frequency_days": 0,
  "watering_amount_ml": 0,
  "soil_ph_min": 0.0,
  "soil_ph_max": 0.0,
  "fertilizer_npk": "NPK ratio optimal for ${plantName}",
  "fertilizer_type": "fertilizer type best for ${plantName}",
  "fertilizer_frequency_weeks": 0,
  "pruning_tips": "${plantName}-specific pruning advice for disease management",
  "pruning_frequency": "timing for ${plantName}",
  "nutrient_deficiencies": [{ "nutrient": "nutrient name", "severity": "none/mild/moderate/severe" }]
}

IMPORTANT: Provide at least 3-4 natural remedies and 2-3 chemical treatments, all specifically researched for ${plantName} + ${diseaseName || 'general health'}.`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('AI failed to return valid JSON');
        return JSON.parse(jsonMatch[0]);
    } catch (err) {
        console.error('[Fallback Generation Error]:', err);
        return {};
    }
}

export async function analyzePlant(imageFile: File, language: Language = 'en'): Promise<PlantAnalysis> {
    console.log('[AI]: Starting precision analysis...');

    try {
        // Primary: Gemini 1.5 Flash Vision
        const geminiResult = await analyzeWithGemini(imageFile, language);
        console.log('[AI]: Gemini analysis successful');
        return geminiResult;
    } catch (geminiErr) {
        console.warn('[AI]: Gemini failed, attempting Plant.id fallback...', geminiErr);

        // Secondary: Plant.id fallback
        const plantIdResult = await analyzeWithPlantId(imageFile);

        if (plantIdResult && plantIdResult.plant_name) {
            console.log('[AI]: Plant.id fallback successful, generating unique treatment for:', plantIdResult.plant_name);

            const detailedInfo = await generateDetailedTreatment(
                plantIdResult.plant_name,
                plantIdResult.disease_name || undefined,
                language
            );

            // Create base with defaults
            return {
                // UI Core defaults
                plant_description: 'Generating botanical description...',
                expert_summary: 'Processing diagnostic data...',
                immediate_actions: ['Monitor environmental conditions'],
                natural_remedies: [],
                chemical_treatments: [],
                prevention_tips: ['Maintain regular watering schedule'],
                growth_description: 'Standard growth pattern.',
                growth_rate: 'normal',
                growth_rate_reason: 'Generic growth habit.',
                sunlight_hours: 6,
                sunlight_intensity: 'medium',
                watering_frequency_days: 3,
                watering_amount_ml: 500,
                soil_ph_min: 6.0,
                soil_ph_max: 7.0,
                fertilizer_npk: '10-10-10',
                fertilizer_type: 'General Purpose',
                fertilizer_frequency_weeks: 4,
                pruning_tips: 'General maintenance pruning.',
                pruning_frequency: 'As needed',
                nutrient_deficiencies: [{ nutrient: 'General', severity: 'none' }],
                health_score: 80,
                confidence_percent: 75,
                severity: 'none',

                // Overwrite with Plant.id identification data
                ...plantIdResult,

                // Overwrite with dynamic Gemini text details
                ...detailedInfo,
            } as PlantAnalysis;
        }

        console.error('[AI]: Both analysis paths failed');
        throw new Error('Comprehensive analysis failed. Please verify your internet connection and try again.');
    }
}
