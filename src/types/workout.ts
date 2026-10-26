export type MuscleGroup =
  | 'peito'
  | 'costas'
  | 'quadriceps'
  | 'isquiotibiais'
  | 'gluteos'
  | 'ombros'
  | 'biceps'
  | 'triceps'
  | 'panturrilha'
  | 'abdomen'
  | 'corpo_inteiro';

export type EquipmentType =
  | 'maquina'
  | 'cabo'
  | 'halteres'
  | 'barra'
  | 'peso_corporal'
  | 'outro';

export type ExerciseType = 'composto' | 'isolado' | 'abdominal' | 'aerobico';

export type DifficultyLevel = 'iniciante' | 'intermediario' | 'avancado';

export interface ExerciseVisualGuide {
  gifUrl?: string; // URL de animação em loop / GIF da execução
  imagePhaseA?: string; // Foto da Fase A (Posição Inicial / Alongamento)
  imagePhaseB?: string; // Foto da Fase B (Pico de Contração)
  cadence: {
    eccentricSeconds: number;
    pauseSeconds: number;
    concentricSeconds: number;
    breathing: string;
  };
  phaseA: {
    title: string;
    description: string;
  };
  phaseB: {
    title: string;
    description: string;
  };
}

export interface Exercise {
  id: string;
  name: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: EquipmentType;
  type: ExerciseType;
  difficulty: DifficultyLevel;
  instructions: string[];
  commonMistakes: string[];
  equipmentSetup: string;
  alternatives: string[]; // IDs ou nomes de exercícios substitutos
  safetyWarnings: string;
  gifUrl?: string; // GIF / vídeo de execução do exercício
  imagePhaseA?: string; // Imagem Fase A (Inicial)
  imagePhaseB?: string; // Imagem Fase B (Pico de contração)
  visualGuide?: ExerciseVisualGuide;
  isCustom?: boolean;
  createdAt: string;
}

export interface WorkoutExerciseConfig {
  exerciseId: string;
  order: number;
  plannedSets: number; // Ex: 2 séries na semana 1
  minReps: number; // Ex: 8
  maxReps: number; // Ex: 12
  restSeconds: number; // Ex: 120 ou 180s para principais, 60-90s para isolados
  targetRir: number; // Ex: 3 na semana 1 de retorno
  notes?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string; // Ex: "Treino A"
  subtitle: string; // Ex: "Ênfase em pernas, peito e costas"
  description: string;
  exercises: WorkoutExerciseConfig[];
  estimatedDurationMinutes: number;
  isCustom?: boolean;
  createdAt: string;
  updatedAt: string;
}
