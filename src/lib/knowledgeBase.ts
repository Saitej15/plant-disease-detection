// Plant Disease Knowledge Base
// This serves as our RAG data source for reliable offline diagnosis

export interface DiseaseKnowledge {
  id: string;
  plantName: string;
  scientificName: string;
  plantFamily: string;
  diseaseName: string;
  diseaseScientificName: string;
  symptoms: string[];
  causes: string[];
  severity: 'none' | 'mild' | 'moderate' | 'severe';
  affectedParts: string[];
  immediateActions: string[];
  naturalRemedies: Array<{
    remedy: string;
    method: string;
    frequency: string;
  }>;
  chemicalTreatments: Array<{
    productType: string;
    activeIngredient: string;
    dosage: string;
    frequency: string;
    precautions: string;
  }>;
  preventionTips: string[];
  careRequirements: {
    sunlightHours: number;
    sunlightIntensity: 'low' | 'medium' | 'high';
    wateringFrequencyDays: number;
    wateringAmountMl: number;
    soilType: string;
    soilPhMin: number;
    soilPhMax: number;
    fertilizerType: string;
    fertilizerNpk: string;
    fertilizerFrequencyWeeks: number;
    temperatureMinC: number;
    temperatureMaxC: number;
    humidityMinPercent: number;
    humidityMaxPercent: number;
  };
  growthInfo: {
    growthRate: 'slow' | 'normal' | 'fast';
    growthStage: string;
    weeksToNextStage: number;
  };
  keywords: string[];
}

export const PLANT_DISEASE_KNOWLEDGE: DiseaseKnowledge[] = [
  {
    id: 'tomato-early-blight',
    plantName: 'Tomato',
    scientificName: 'Solanum lycopersicum',
    plantFamily: 'Solanaceae',
    diseaseName: 'Early Blight',
    diseaseScientificName: 'Alternaria solani',
    symptoms: [
      'Dark brown spots with concentric rings on lower leaves',
      'Yellow halo around spots',
      'Leaf yellowing and dropping',
      'Stem lesions near soil line',
      'Fruit spots near stem end'
    ],
    causes: [
      'Fungal pathogen Alternaria solani',
      'Warm humid weather (24-29°C)',
      'Poor air circulation',
      'Overhead watering',
      'Nutrient deficiency weakening plants'
    ],
    severity: 'moderate',
    affectedParts: ['leaves', 'stems', 'fruits'],
    immediateActions: [
      'Remove and destroy infected leaves immediately',
      'Stop overhead watering - water at soil level only',
      'Improve air circulation by pruning lower branches',
      'Apply copper-based fungicide within 24 hours',
      'Mulch around plants to prevent soil splash'
    ],
    naturalRemedies: [
      {
        remedy: 'Baking Soda Spray',
        method: 'Mix 1 tablespoon baking soda + 1 tablespoon vegetable oil + 1 drop dish soap in 1 gallon water. Spray all plant surfaces thoroughly.',
        frequency: 'Every 7 days, reapply after rain'
      },
      {
        remedy: 'Neem Oil Solution',
        method: 'Mix 2 tablespoons pure neem oil + 1 teaspoon mild soap in 1 gallon water. Spray in early morning or evening.',
        frequency: 'Every 7-14 days'
      },
      {
        remedy: 'Copper Fungicide (Organic)',
        method: 'Apply copper sulfate or copper hydroxide according to label. Ensure complete leaf coverage.',
        frequency: 'Every 7-10 days during wet weather'
      }
    ],
    chemicalTreatments: [
      {
        productType: 'Fungicide - Chlorothalonil',
        activeIngredient: 'Chlorothalonil 82.5%',
        dosage: '2-3 ml per liter of water',
        frequency: 'Every 7-10 days, maximum 4 applications',
        precautions: 'Wear gloves and mask. Do not spray during flowering. Wait 7 days before harvest.'
      },
      {
        productType: 'Fungicide - Mancozeb',
        activeIngredient: 'Mancozeb 75% WP',
        dosage: '2.5 grams per liter of water',
        frequency: 'Every 7-14 days',
        precautions: 'Avoid contact with skin. Wait 5 days before harvest.'
      }
    ],
    preventionTips: [
      'Rotate tomato crops every 3 years',
      'Space plants 60-90cm apart for air circulation',
      'Mulch with straw to prevent soil splash',
      'Water early morning at soil level only',
      'Remove lower leaves touching ground',
      'Use disease-resistant varieties',
      'Maintain balanced fertilization'
    ],
    careRequirements: {
      sunlightHours: 6,
      sunlightIntensity: 'high',
      wateringFrequencyDays: 2,
      wateringAmountMl: 2000,
      soilType: 'Well-draining loamy soil rich in organic matter',
      soilPhMin: 6.0,
      soilPhMax: 6.8,
      fertilizerType: 'Balanced NPK with calcium',
      fertilizerNpk: '10-10-10',
      fertilizerFrequencyWeeks: 2,
      temperatureMinC: 18,
      temperatureMaxC: 29,
      humidityMinPercent: 40,
      humidityMaxPercent: 70
    },
    growthInfo: {
      growthRate: 'fast',
      growthStage: 'vegetative',
      weeksToNextStage: 4
    },
    keywords: ['tomato', 'early blight', 'alternaria', 'brown spots', 'concentric rings', 'leaf spots']
  },
  {
    id: 'rose-black-spot',
    plantName: 'Rose',
    scientificName: 'Rosa spp.',
    plantFamily: 'Rosaceae',
    diseaseName: 'Black Spot',
    diseaseScientificName: 'Diplocarpon rosae',
    symptoms: [
      'Circular black spots with fringed edges on leaves',
      'Yellow halo around black spots',
      'Premature leaf drop starting from bottom',
      'Weakened plant growth',
      'Reduced flowering'
    ],
    causes: [
      'Fungal pathogen Diplocarpon rosae',
      'Wet leaves for 7+ hours',
      'High humidity above 85%',
      'Poor air circulation',
      'Overhead watering',
      'Infected plant debris'
    ],
    severity: 'moderate',
    affectedParts: ['leaves', 'stems'],
    immediateActions: [
      'Remove all infected leaves and destroy (do not compost)',
      'Clean up fallen leaves around plant base',
      'Stop overhead watering immediately',
      'Prune for better air circulation',
      'Apply fungicide to remaining healthy foliage'
    ],
    naturalRemedies: [
      {
        remedy: 'Baking Soda + Horticultural Oil',
        method: 'Mix 1 tablespoon baking soda + 2 tablespoons horticultural oil + 1 drop dish soap in 1 gallon water. Spray thoroughly.',
        frequency: 'Every 7 days, especially after rain'
      },
      {
        remedy: 'Neem Oil Concentrate',
        method: 'Mix 2 tablespoons neem oil + 1 teaspoon insecticidal soap in 1 gallon water. Spray all leaf surfaces.',
        frequency: 'Every 7-10 days'
      },
      {
        remedy: 'Sulfur Dust',
        method: 'Apply sulfur dust to dry foliage in early morning. Ensure complete coverage.',
        frequency: 'Every 10-14 days'
      }
    ],
    chemicalTreatments: [
      {
        productType: 'Systemic Fungicide - Tebuconazole',
        activeIngredient: 'Tebuconazole 25% EC',
        dosage: '1 ml per liter of water',
        frequency: 'Every 14 days, maximum 3 applications per season',
        precautions: 'Highly toxic to aquatic life. Wear protective gear. Do not spray on open blooms.'
      },
      {
        productType: 'Contact Fungicide - Mancozeb',
        activeIngredient: 'Mancozeb 75% WP',
        dosage: '2 grams per liter of water',
        frequency: 'Every 7-10 days during wet weather',
        precautions: 'Avoid inhalation. Wash hands after application.'
      }
    ],
    preventionTips: [
      'Plant disease-resistant rose varieties',
      'Space roses 90-120cm apart',
      'Water at soil level in early morning',
      'Mulch to prevent soil splash',
      'Prune for open center and air flow',
      'Remove and destroy fallen leaves weekly',
      'Avoid working with wet plants'
    ],
    careRequirements: {
      sunlightHours: 6,
      sunlightIntensity: 'high',
      wateringFrequencyDays: 3,
      wateringAmountMl: 3000,
      soilType: 'Rich, well-draining loam with organic matter',
      soilPhMin: 6.0,
      soilPhMax: 7.0,
      fertilizerType: 'Rose-specific fertilizer',
      fertilizerNpk: '5-10-5',
      fertilizerFrequencyWeeks: 4,
      temperatureMinC: 15,
      temperatureMaxC: 27,
      humidityMinPercent: 40,
      humidityMaxPercent: 60
    },
    growthInfo: {
      growthRate: 'normal',
      growthStage: 'flowering',
      weeksToNextStage: 6
    },
    keywords: ['rose', 'black spot', 'diplocarpon', 'black spots', 'yellow halo', 'leaf drop']
  },
  {
    id: 'potato-late-blight',
    plantName: 'Potato',
    scientificName: 'Solanum tuberosum',
    plantFamily: 'Solanaceae',
    diseaseName: 'Late Blight',
    diseaseScientificName: 'Phytophthora infestans',
    symptoms: [
      'Water-soaked spots on leaves',
      'White fuzzy growth on leaf undersides',
      'Brown-black lesions spreading rapidly',
      'Entire plant collapse within days',
      'Tuber rot with brown flesh'
    ],
    causes: [
      'Oomycete pathogen Phytophthora infestans',
      'Cool wet weather (10-25°C)',
      'High humidity above 90%',
      'Infected seed potatoes',
      'Wind-borne spores from nearby infected plants'
    ],
    severity: 'severe',
    affectedParts: ['leaves', 'stems', 'tubers'],
    immediateActions: [
      'Remove and burn all infected plants immediately',
      'Do not compost infected material',
      'Apply copper fungicide to healthy plants within 24 hours',
      'Harvest unaffected tubers immediately',
      'Destroy volunteer potato plants in area'
    ],
    naturalRemedies: [
      {
        remedy: 'Copper Sulfate Spray',
        method: 'Mix 3 tablespoons copper sulfate in 1 gallon water. Spray all foliage thoroughly.',
        frequency: 'Every 5-7 days during wet weather'
      },
      {
        remedy: 'Bordeaux Mixture',
        method: 'Mix copper sulfate and hydrated lime. Apply to all plant surfaces.',
        frequency: 'Every 7-10 days preventatively'
      }
    ],
    chemicalTreatments: [
      {
        productType: 'Systemic Fungicide - Metalaxyl',
        activeIngredient: 'Metalaxyl 8% + Mancozeb 64%',
        dosage: '2.5 grams per liter of water',
        frequency: 'Every 7-10 days, alternate with contact fungicides',
        precautions: 'Highly toxic. Wear full protective gear. Do not harvest for 14 days after application.'
      },
      {
        productType: 'Contact Fungicide - Chlorothalonil',
        activeIngredient: 'Chlorothalonil 75% WP',
        dosage: '2 grams per liter of water',
        frequency: 'Every 5-7 days during disease pressure',
        precautions: 'Avoid spray drift. Wait 7 days before harvest.'
      }
    ],
    preventionTips: [
      'Plant certified disease-free seed potatoes',
      'Use resistant varieties like Defender or Sarpo Mira',
      'Space plants 30cm apart for air circulation',
      'Hill soil around stems to protect tubers',
      'Remove volunteer potatoes from previous season',
      'Avoid overhead irrigation',
      'Monitor weather for blight-favorable conditions'
    ],
    careRequirements: {
      sunlightHours: 6,
      sunlightIntensity: 'high',
      wateringFrequencyDays: 3,
      wateringAmountMl: 2500,
      soilType: 'Loose, well-draining sandy loam',
      soilPhMin: 5.0,
      soilPhMax: 6.5,
      fertilizerType: 'High potassium fertilizer',
      fertilizerNpk: '5-10-15',
      fertilizerFrequencyWeeks: 3,
      temperatureMinC: 15,
      temperatureMaxC: 24,
      humidityMinPercent: 50,
      humidityMaxPercent: 70
    },
    growthInfo: {
      growthRate: 'fast',
      growthStage: 'tuber formation',
      weeksToNextStage: 8
    },
    keywords: ['potato', 'late blight', 'phytophthora', 'water-soaked', 'tuber rot', 'white mold']
  },
  {
    id: 'wheat-rust',
    plantName: 'Wheat',
    scientificName: 'Triticum aestivum',
    plantFamily: 'Poaceae',
    diseaseName: 'Leaf Rust',
    diseaseScientificName: 'Puccinia triticina',
    symptoms: [
      'Orange-brown pustules on leaves',
      'Pustules arranged in scattered pattern',
      'Yellow halo around pustules',
      'Premature leaf drying',
      'Reduced grain fill and quality'
    ],
    causes: [
      'Fungal pathogen Puccinia triticina',
      'Moderate temperatures (15-22°C)',
      'High humidity and dew',
      'Wind-borne spores',
      'Susceptible wheat varieties'
    ],
    severity: 'moderate',
    affectedParts: ['leaves', 'stems'],
    immediateActions: [
      'Scout fields weekly for early detection',
      'Apply fungicide when 5% leaf area affected',
      'Focus on flag leaf protection',
      'Remove volunteer wheat plants',
      'Plan crop rotation for next season'
    ],
    naturalRemedies: [
      {
        remedy: 'Sulfur Dust Application',
        method: 'Apply sulfur dust at 10 kg per hectare to dry foliage.',
        frequency: 'Every 14 days if disease pressure continues'
      },
      {
        remedy: 'Neem Extract Spray',
        method: 'Mix 5 ml neem extract per liter water. Spray at early infection stage.',
        frequency: 'Every 10 days'
      }
    ],
    chemicalTreatments: [
      {
        productType: 'Triazole Fungicide - Propiconazole',
        activeIngredient: 'Propiconazole 25% EC',
        dosage: '0.5 ml per liter of water, 200-300 liters per hectare',
        frequency: 'Single application at flag leaf stage',
        precautions: 'Do not apply during flowering. Observe 35-day pre-harvest interval.'
      },
      {
        productType: 'Strobilurin Fungicide - Azoxystrobin',
        activeIngredient: 'Azoxystrobin 23% SC',
        dosage: '1 ml per liter of water',
        frequency: 'Apply at early infection, do not exceed 2 applications',
        precautions: 'Alternate with different mode of action to prevent resistance.'
      }
    ],
    preventionTips: [
      'Plant rust-resistant wheat varieties',
      'Destroy crop residue after harvest',
      'Avoid excessive nitrogen fertilization',
      'Maintain proper plant spacing',
      'Monitor regional rust alerts',
      'Use seed treatment fungicides',
      'Implement 2-3 year crop rotation'
    ],
    careRequirements: {
      sunlightHours: 8,
      sunlightIntensity: 'high',
      wateringFrequencyDays: 7,
      wateringAmountMl: 5000,
      soilType: 'Well-draining loam to clay loam',
      soilPhMin: 6.0,
      soilPhMax: 7.5,
      fertilizerType: 'Nitrogen-based with micronutrients',
      fertilizerNpk: '20-10-10',
      fertilizerFrequencyWeeks: 6,
      temperatureMinC: 12,
      temperatureMaxC: 25,
      humidityMinPercent: 40,
      humidityMaxPercent: 70
    },
    growthInfo: {
      growthRate: 'normal',
      growthStage: 'heading',
      weeksToNextStage: 4
    },
    keywords: ['wheat', 'rust', 'puccinia', 'orange pustules', 'leaf rust', 'grain crop']
  }
];

// Semantic search function - simple keyword matching for now
export function searchKnowledgeBase(query: string): DiseaseKnowledge[] {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);
  
  return PLANT_DISEASE_KNOWLEDGE
    .map(disease => {
      let score = 0;
      
      // Check keywords
      disease.keywords.forEach(keyword => {
        if (queryWords.some(word => keyword.includes(word) || word.includes(keyword))) {
          score += 3;
        }
      });
      
      // Check plant name
      if (queryWords.some(word => disease.plantName.toLowerCase().includes(word))) {
        score += 5;
      }
      
      // Check disease name
      if (queryWords.some(word => disease.diseaseName.toLowerCase().includes(word))) {
        score += 5;
      }
      
      // Check symptoms
      disease.symptoms.forEach(symptom => {
        if (queryWords.some(word => symptom.toLowerCase().includes(word))) {
          score += 2;
        }
      });
      
      return { disease, score };
    })
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(result => result.disease);
}
