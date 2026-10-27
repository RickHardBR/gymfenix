export type ExperienceLevel = 'iniciante' | 'intermediario' | 'avancado';

export type TrainingMethod = 'fullbody_abc' | 'upper_lower' | 'ppl' | 'outro';

export interface UserProfile {
  name: string;
  nickname?: string;
  gender?: 'masculino' | 'feminino';
  age?: number;
  weightKg?: number;
  heightCm?: number;
  waistCm?: number; // Circunferência da cintura
  neckCm?: number; // Circunferência do pescoço
  hipCm?: number; // Circunferência do quadril (especialmente feminino)
  bodyFatPercentage?: number; // % de gordura corporal
  mainGoal: string;
  trainingLocation: string;
  experienceLevel: ExperienceLevel;
  experienceDescription: string;
  weeklyFrequency: number;
  method: TrainingMethod;
  methodDescription: string;
  availableDurationMinutes: {
    min: number;
    max: number;
  };
  initialStatus: {
    daysInactive: number;
    description: string;
    lumbarCondition: string;
    currentPain: boolean;
    painNotes: string;
  };
  priorities: string[];
  updatedAt: string;
}

export interface UserSettings {
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  autoStartTimer: boolean;
  restTimerDefaultSeconds: number;
}

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Atleta Fênix',
  nickname: 'Fênix',
  gender: 'masculino',
  age: 30,
  weightKg: 82.5,
  heightCm: 178,
  waistCm: 86,
  neckCm: 39,
  hipCm: 98,
  bodyFatPercentage: 16.5,
  mainGoal: 'Desenvolver força e massa muscular e melhorar a composição corporal',
  trainingLocation: 'Academia equipada com máquinas, cabos, halteres e barras',
  experienceLevel: 'intermediario',
  experienceDescription: 'Intermediária (aproximadamente 6 meses a 2 anos de prática)',
  weeklyFrequency: 3,
  method: 'fullbody_abc',
  methodDescription: 'Full Body com treinos alternados A, B e C (3x por semana)',
  availableDurationMinutes: {
    min: 60,
    max: 90,
  },
  initialStatus: {
    daysInactive: 14,
    description: 'Retorno gradual após duas semanas sem treinar',
    lumbarCondition: 'Sem dor no momento, mas com histórico de desconforto durante exercícios com cargas elevadas',
    currentPain: false,
    painNotes: 'Evitar cargas máximas, focar em estabilidade e apoio lombar',
  },
  priorities: [
    'Segurança articular e postural',
    'Consistência e regularidade',
    'Progressão dupla de cargas sustentável',
    'Preservação e ganho de massa muscular',
    'Acompanhamento de força a longo prazo',
  ],
  updatedAt: new Date().toISOString(),
};

export const INITIAL_USER_SETTINGS: UserSettings = {
  theme: 'dark',
  soundEnabled: true,
  vibrationEnabled: true,
  autoStartTimer: true,
  restTimerDefaultSeconds: 90,
};
