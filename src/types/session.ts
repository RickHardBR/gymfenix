export type SetType = 'trabalho' | 'aquecimento' | 'falha';

export interface ExerciseSetLog {
  id: string;
  setNumber: number;
  type: SetType;
  weightKg: number;
  reps: number;
  rir: number; // Repetições em Reserva (0 a 5)
  isCompleted: boolean;
  completedAt?: string;
}

export interface PainReport {
  region: string;
  intensity: number; // 1 a 10
  stopped: boolean;
  notes: string;
}

export interface SessionExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: ExerciseSetLog[];
  notes?: string;
  restSeconds: number;
  targetRir: number;
  painReport?: PainReport;
}

export type SessionStatus = 'em_andamento' | 'concluido' | 'cancelado';

export interface WorkoutSession {
  id: string;
  templateId: string;
  templateName: string;
  startedAt: string;
  finishedAt?: string;
  durationSeconds: number;
  status: SessionStatus;
  exercises: SessionExerciseLog[];
  totalVolumeKg: number; // Carga x Reps apenas de séries de trabalho
  totalWorkingSets: number;
  notes?: string;
}
