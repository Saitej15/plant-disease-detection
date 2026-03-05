// All shared TypeScript types for PlantIQ

export type SeverityLevel = 'none' | 'mild' | 'moderate' | 'severe';
export type GrowthStage = 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'mature';
export type GrowthRate = 'slow' | 'normal' | 'fast';
export type SunlightIntensity = 'low' | 'medium' | 'high' | 'full';
export type Plan = 'free' | 'pro' | 'enterprise';

export interface NutrientDeficiency {
    nutrient: string;
    severity: string;
    symptoms: string;
}

export interface NaturalRemedy {
    remedy: string;
    method: string;
    frequency: string;
}

export interface ChemicalTreatment {
    product_type: string;
    active_ingredient: string;
    dosage: string;
    frequency: string;
    precautions: string;
}

export interface PlantAnalysis {
    plant_name: string;
    scientific_name: string;
    plant_family: string;
    confidence_percent: number;
    plant_description: string;

    disease_detected: boolean;
    disease_name: string | null;
    disease_scientific_name: string | null;
    severity: SeverityLevel;
    affected_area_percent: number;
    disease_description: string;
    disease_causes: string[];
    immediate_actions: string[];
    natural_remedies: NaturalRemedy[];
    chemical_treatments: ChemicalTreatment[];
    prevention_tips: string[];

    health_score: number;
    growth_stage: GrowthStage;
    growth_rate: GrowthRate;
    growth_rate_reason: string;
    weeks_to_next_stage: number;
    nutrient_deficiencies: NutrientDeficiency[];

    sunlight_hours: number;
    sunlight_intensity: SunlightIntensity;
    watering_frequency_days: number;
    watering_amount_ml: number;
    soil_type: string;
    soil_ph_min: number;
    soil_ph_max: number;
    fertilizer_type: string;
    fertilizer_npk: string;
    fertilizer_frequency_weeks: number;
    temperature_min_c: number;
    temperature_max_c: number;
    humidity_min_percent: number;
    humidity_max_percent: number;
    pruning_tips: string;
    pruning_frequency: string;
    companion_plants: string[];
    incompatible_plants: string[];
    common_mistakes: string[];
    fast_growth_tips: string[];
    expert_summary: string;
}

export interface Scan {
    id: string;
    user_id: string;
    image_url: string;
    plant_name: string;
    scientific_name?: string;
    confidence?: number;
    health_score: number;
    growth_stage: GrowthStage;
    disease_detected: boolean;
    disease_name?: string;
    severity?: SeverityLevel;
    full_analysis: PlantAnalysis;
    created_at: string;
}

export interface User {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    plan: Plan;
    scans_this_month: number;
    created_at: string;
}

export interface DashboardStats {
    total_scans: number;
    healthy_plants: number;
    diseases_detected: number;
    plants_identified: number;
    health_trend: Array<{ date: string; score: number; plant_name: string }>;
}

export interface EncyclopediaPlant {
    id: string;
    name: string;
    scientific_name: string;
    family: string;
    care_difficulty: 'easy' | 'medium' | 'hard';
    image_url: string;
    description: string;
    care_guide?: PlantAnalysis;
}

export type AnalysisStep =
    | 'uploading'
    | 'identifying'
    | 'scanning_diseases'
    | 'analyzing_growth'
    | 'generating_report'
    | 'complete'
    | 'error';
