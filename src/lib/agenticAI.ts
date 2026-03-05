// Agentic AI System for Plant Disease Diagnosis
// Multi-step reasoning agent that uses RAG and fallback strategies

import type { PlantAnalysis } from '../types';
import type { Language } from '../store/languageStore';
import { searchKnowledgeBase, type DiseaseKnowledge } from './knowledgeBase';
import { analyzeWithPlantId } from './ai';

interface AgentStep {
  step: string;
  action: string;
  result: any;
  confidence: number;
}

interface AgentState {
  steps: AgentStep[];
  plantIdentified: boolean;
  diseaseIdentified: boolean;
  knowledgeRetrieved: boolean;
  finalAnalysis: PlantAnalysis | null;
}

export class PlantDiagnosisAgent {
  private state: AgentState;
  private imageFile: File;

  constructor(imageFile: File, _language: Language = 'en') {
    this.imageFile = imageFile;
    this.state = {
      steps: [],
      plantIdentified: false,
      diseaseIdentified: false,
      knowledgeRetrieved: false,
      finalAnalysis: null
    };
  }

  private log(step: string, action: string, result: any, confidence: number) {
    console.log(`[Agent] ${step}: ${action} (confidence: ${confidence}%)`);
    this.state.steps.push({ step, action, result, confidence });
  }

  // Step 1: Identify plant using Plant.id API
  private async identifyPlant(): Promise<{ plantName: string; diseaseName: string | null; confidence: number }> {
    this.log('Step 1', 'Identifying plant using Plant.id API', null, 0);
    
    try {
      const plantIdResult = await analyzeWithPlantId(this.imageFile);
      
      if (plantIdResult && plantIdResult.plant_name) {
        const confidence = plantIdResult.confidence_percent || 0;
        this.state.plantIdentified = true;
        
        const result = {
          plantName: plantIdResult.plant_name,
          diseaseName: plantIdResult.disease_name || null,
          confidence
        };
        
        this.log('Step 1', 'Plant identified successfully', result, confidence);
        return result;
      }
    } catch (error) {
      console.error('[Agent] Plant.id failed:', error);
    }
    
    // Fallback: Return unknown
    this.log('Step 1', 'Plant identification failed - using fallback', null, 0);
    return { plantName: 'Unknown Plant', diseaseName: null, confidence: 0 };
  }

  // Step 2: Search knowledge base using RAG
  private searchKnowledge(plantName: string, diseaseName: string | null): DiseaseKnowledge | null {
    this.log('Step 2', 'Searching knowledge base with RAG', { plantName, diseaseName }, 0);
    
    const query = diseaseName 
      ? `${plantName} ${diseaseName}` 
      : plantName;
    
    const results = searchKnowledgeBase(query);
    
    if (results.length > 0) {
      this.state.knowledgeRetrieved = true;
      const bestMatch = results[0];
      this.log('Step 2', 'Knowledge retrieved from database', bestMatch, 90);
      return bestMatch;
    }
    
    this.log('Step 2', 'No matching knowledge found', null, 0);
    return null;
  }

  // Step 3: Generate analysis from knowledge base
  private generateAnalysisFromKnowledge(
    knowledge: DiseaseKnowledge,
    plantIdData: any
  ): PlantAnalysis {
    this.log('Step 3', 'Generating analysis from knowledge base', null, 95);
    
    const healthScore = knowledge.severity === 'none' ? 100 :
                       knowledge.severity === 'mild' ? 75 :
                       knowledge.severity === 'moderate' ? 50 : 25;
    
    return {
      plant_name: knowledge.plantName,
      scientific_name: knowledge.scientificName,
      plant_family: knowledge.plantFamily,
      confidence_percent: plantIdData.confidence || 85,
      plant_description: `${knowledge.plantName} (${knowledge.scientificName}) is a member of the ${knowledge.plantFamily} family.`,
      disease_detected: knowledge.diseaseName !== 'Healthy',
      disease_name: knowledge.diseaseName,
      disease_scientific_name: knowledge.diseaseScientificName,
      severity: knowledge.severity,
      affected_area_percent: knowledge.severity === 'severe' ? 60 : knowledge.severity === 'moderate' ? 30 : 10,
      disease_description: knowledge.symptoms.join('. '),
      disease_causes: knowledge.causes,
      immediate_actions: knowledge.immediateActions,
      natural_remedies: knowledge.naturalRemedies,
      chemical_treatments: knowledge.chemicalTreatments.map(ct => ({
        product_type: ct.productType,
        active_ingredient: ct.activeIngredient,
        dosage: ct.dosage,
        frequency: ct.frequency,
        precautions: ct.precautions
      })),
      prevention_tips: knowledge.preventionTips,
      health_score: healthScore,
      growth_stage: knowledge.growthInfo.growthStage as any,
      growth_rate: knowledge.growthInfo.growthRate,
      growth_rate_reason: `Based on ${knowledge.plantName} typical growth patterns`,
      weeks_to_next_stage: knowledge.growthInfo.weeksToNextStage,
      nutrient_deficiencies: [],
      sunlight_hours: knowledge.careRequirements.sunlightHours,
      sunlight_intensity: knowledge.careRequirements.sunlightIntensity,
      watering_frequency_days: knowledge.careRequirements.wateringFrequencyDays,
      watering_amount_ml: knowledge.careRequirements.wateringAmountMl,
      soil_type: knowledge.careRequirements.soilType,
      soil_ph_min: knowledge.careRequirements.soilPhMin,
      soil_ph_max: knowledge.careRequirements.soilPhMax,
      fertilizer_type: knowledge.careRequirements.fertilizerType,
      fertilizer_npk: knowledge.careRequirements.fertilizerNpk,
      fertilizer_frequency_weeks: knowledge.careRequirements.fertilizerFrequencyWeeks,
      temperature_min_c: knowledge.careRequirements.temperatureMinC,
      temperature_max_c: knowledge.careRequirements.temperatureMaxC,
      humidity_min_percent: knowledge.careRequirements.humidityMinPercent,
      humidity_max_percent: knowledge.careRequirements.humidityMaxPercent,
      pruning_tips: knowledge.preventionTips[0] || 'Regular pruning recommended',
      pruning_frequency: 'Monthly',
      companion_plants: [],
      incompatible_plants: [],
      common_mistakes: [],
      fast_growth_tips: [],
      expert_summary: `${knowledge.plantName} showing ${knowledge.diseaseName}. ${knowledge.immediateActions[0]}`
    };
  }

  // Step 4: Generate generic analysis as fallback
  private generateGenericAnalysis(plantName: string, diseaseName: string | null): PlantAnalysis {
    this.log('Step 4', 'Generating generic analysis (fallback)', null, 50);
    
    return {
      plant_name: plantName,
      scientific_name: 'Unknown',
      plant_family: 'Unknown',
      confidence_percent: 50,
      plant_description: `This appears to be a ${plantName}. For accurate diagnosis, please consult with a local agricultural expert.`,
      disease_detected: !!diseaseName,
      disease_name: diseaseName,
      disease_scientific_name: null,
      severity: diseaseName ? 'moderate' : 'none',
      affected_area_percent: diseaseName ? 30 : 0,
      disease_description: diseaseName ? `Possible ${diseaseName} detected. Recommend professional inspection.` : 'Plant appears healthy.',
      disease_causes: diseaseName ? ['Environmental stress', 'Pathogen infection', 'Nutrient imbalance'] : [],
      immediate_actions: diseaseName ? [
        'Isolate affected plant from healthy plants',
        'Remove visibly damaged leaves',
        'Improve air circulation around plant',
        'Adjust watering schedule',
        'Consult local agricultural extension office'
      ] : ['Continue regular care routine', 'Monitor plant health weekly'],
      natural_remedies: [
        {
          remedy: 'Neem Oil Spray',
          method: 'Mix 2 tablespoons neem oil with 1 gallon water and spray affected areas',
          frequency: 'Weekly application'
        }
      ],
      chemical_treatments: [
        {
          product_type: 'General Fungicide',
          active_ingredient: 'Copper-based compound',
          dosage: 'Follow product label instructions',
          frequency: 'As directed on label',
          precautions: 'Wear protective equipment. Keep away from children and pets.'
        }
      ],
      prevention_tips: [
        'Ensure proper drainage',
        'Maintain adequate spacing between plants',
        'Water at soil level, avoid wetting foliage',
        'Remove dead plant material regularly',
        'Monitor for early signs of disease'
      ],
      health_score: diseaseName ? 60 : 80,
      growth_stage: 'vegetative',
      growth_rate: 'normal',
      growth_rate_reason: 'Standard growth pattern observed',
      weeks_to_next_stage: 4,
      nutrient_deficiencies: [],
      sunlight_hours: 6,
      sunlight_intensity: 'medium',
      watering_frequency_days: 3,
      watering_amount_ml: 1000,
      soil_type: 'Well-draining loamy soil',
      soil_ph_min: 6.0,
      soil_ph_max: 7.0,
      fertilizer_type: 'Balanced NPK',
      fertilizer_npk: '10-10-10',
      fertilizer_frequency_weeks: 4,
      temperature_min_c: 18,
      temperature_max_c: 28,
      humidity_min_percent: 40,
      humidity_max_percent: 70,
      pruning_tips: 'Prune dead or diseased branches regularly',
      pruning_frequency: 'Monthly or as needed',
      companion_plants: [],
      incompatible_plants: [],
      common_mistakes: [],
      fast_growth_tips: [],
      expert_summary: `${plantName} identified. ${diseaseName ? 'Disease detected - recommend immediate treatment.' : 'Plant appears healthy - continue regular care.'}`
    };
  }

  // Main agent execution
  async diagnose(): Promise<PlantAnalysis> {
    console.log('[Agent] Starting multi-step diagnosis...');
    
    try {
      // Step 1: Identify plant
      const plantData = await this.identifyPlant();
      
      // Step 2: Search knowledge base
      const knowledge = this.searchKnowledge(plantData.plantName, plantData.diseaseName);
      
      // Step 3: Generate analysis
      if (knowledge) {
        this.state.finalAnalysis = this.generateAnalysisFromKnowledge(knowledge, plantData);
        console.log('[Agent] Diagnosis complete using knowledge base');
        return this.state.finalAnalysis;
      }
      
      // Step 4: Fallback to generic analysis
      this.state.finalAnalysis = this.generateGenericAnalysis(plantData.plantName, plantData.diseaseName);
      console.log('[Agent] Diagnosis complete using fallback');
      return this.state.finalAnalysis;
      
    } catch (error) {
      console.error('[Agent] Diagnosis failed:', error);
      
      // Ultimate fallback
      return this.generateGenericAnalysis('Unknown Plant', null);
    }
  }

  getState(): AgentState {
    return this.state;
  }
}

// Main function to use the agent
export async function diagnoseWithAgent(imageFile: File, language: Language = 'en'): Promise<PlantAnalysis> {
  const agent = new PlantDiagnosisAgent(imageFile, language);
  return await agent.diagnose();
}
