import type { WorkoutSession, PainReport, SessionExerciseLog } from '../types/session';
import type { MuscleGroup, Exercise } from '../types/workout';

export interface ProgressionRecommendation {
  status: 'aumentar_carga' | 'progredir_reps' | 'manter_carga' | 'reduzir_deload_dor' | 'dados_insuficientes';
  currentWeightKg: number;
  suggestedWeightKg: number;
  targetMinReps: number;
  targetMaxReps: number;
  completedReps: number[];
  avgRir: number;
  message: string;
  detail: string;
  hasPainAlert: boolean;
}

export interface ExerciseProgressPoint {
  date: string;
  timestamp: number;
  sessionName: string;
  maxWeightKg: number;
  estimated1RM: number;
  totalWorkingReps: number;
  volumeKg: number;
  avgRir: number;
  hasPain: boolean;
}

export interface MuscleVolumeSummary {
  muscle: MuscleGroup;
  label: string;
  workingSets: number;
  volumeKg: number;
}

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  peito: 'Peitoral',
  costas: 'Costas',
  quadriceps: 'Quadríceps',
  isquiotibiais: 'Isquiotibiais',
  gluteos: 'Glúteos',
  ombros: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  panturrilha: 'Panturrilhas',
  abdomen: 'Abdômen',
  corpo_inteiro: 'Corpo Inteiro',
};

/**
 * Calcula 1RM estimado pela fórmula de Epley:
 * 1RM = Carga * (1 + Reps / 30)
 */
export const calculateEstimatedOneRepMax = (weightKg: number, reps: number): number => {
  if (weightKg <= 0 || reps <= 0) return 0;
  if (reps === 1) return weightKg;
  const estimate = weightKg * (1 + reps / 30);
  return Math.round(estimate * 10) / 10;
};

/**
 * Avalia o progresso recente do atleta no exercício e aplica as regras de progressão dupla:
 * - Se completou todas as séries de trabalho no topo da faixa (maxReps) com RIR seguro: recomenda aumento gradual de carga.
 * - Se ainda não completou: mantém a carga e busca somar repetições.
 * - Se houve relato de dor: aciona protocolo de segurança com deload/manutenção.
 */
export const analyzeDoubleProgression = (
  exerciseId: string,
  targetMinReps: number,
  targetMaxReps: number,
  completedSessions: WorkoutSession[],
  recentPainLogs?: PainReport[]
): ProgressionRecommendation => {
  const sortedSessions = [...completedSessions]
    .filter((s) => s.status === 'concluido')
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

  // Procura a sessão mais recente com este exercício
  let targetExerciseLog: SessionExerciseLog | null = null;
  for (const session of sortedSessions) {
    const found = session.exercises.find((e) => e.exerciseId === exerciseId);
    if (found && found.sets.some((s) => s.isCompleted && s.type === 'trabalho')) {
      targetExerciseLog = found;
      break;
    }
  }

  // Se não houver dados anteriores
  if (!targetExerciseLog) {
    return {
      status: 'dados_insuficientes',
      currentWeightKg: 0,
      suggestedWeightKg: 0,
      targetMinReps,
      targetMaxReps,
      completedReps: [],
      avgRir: 0,
      message: 'Sem histórico anterior',
      detail: 'Complete ao menos uma sessão deste exercício para ativar recomendações automáticas de progressão.',
      hasPainAlert: false,
    };
  }

  const workingSets = targetExerciseLog.sets.filter((s) => s.isCompleted && s.type === 'trabalho');
  if (workingSets.length === 0) {
    return {
      status: 'dados_insuficientes',
      currentWeightKg: 0,
      suggestedWeightKg: 0,
      targetMinReps,
      targetMaxReps,
      completedReps: [],
      avgRir: 0,
      message: 'Séries de trabalho não registradas',
      detail: 'Registre as séries de trabalho para gerar sugestões de carga.',
      hasPainAlert: false,
    };
  }

  const completedReps = workingSets.map((s) => s.reps);
  const currentWeightKg = Math.max(...workingSets.map((s) => s.weightKg));
  const avgRir = Math.round((workingSets.reduce((acc, s) => acc + s.rir, 0) / workingSets.length) * 10) / 10;

  // Verifica histórico de dor recente no exercício
  const painInThisExercise = targetExerciseLog.painReport;
  const hasSeverePain = painInThisExercise && (painInThisExercise.intensity >= 4 || painInThisExercise.stopped);
  const externalPain = recentPainLogs?.find((p) => p.intensity >= 4 || p.stopped);

  if (hasSeverePain || externalPain) {
    const safeReducedWeight = Math.max(0, Math.round(currentWeightKg * 0.85 * 2) / 2);
    return {
      status: 'reduzir_deload_dor',
      currentWeightKg,
      suggestedWeightKg: safeReducedWeight > 0 ? safeReducedWeight : currentWeightKg,
      targetMinReps,
      targetMaxReps,
      completedReps,
      avgRir,
      message: 'Alerta Lombar / Articular Detectado',
      detail: 'Houve relato recente de desconforto. Priorize estabilidade, mantenha ou reduza a carga em ~15% e mantenha RIR >= 3.',
      hasPainAlert: true,
    };
  }

  // Verifica se todas as séries de trabalho atingiram o teto da faixa de repetições
  const allReachedCeiling = workingSets.every((s) => s.reps >= targetMaxReps);
  const safeRir = avgRir >= 1.5;

  if (allReachedCeiling && safeRir && currentWeightKg > 0) {
    // Incremento sugerido: +1kg a +2.5kg (múltiplo de 1kg ou 2kg para halteres)
    const increment = currentWeightKg >= 40 ? 2.5 : currentWeightKg >= 20 ? 2 : 1;
    const suggestedWeightKg = currentWeightKg + increment;

    return {
      status: 'aumentar_carga',
      currentWeightKg,
      suggestedWeightKg,
      targetMinReps,
      targetMaxReps,
      completedReps,
      avgRir,
      message: `Meta atingida! Subir para ${suggestedWeightKg} kg (+${increment} kg)`,
      detail: `Você completou ${targetMaxReps} reps em todas as séries com RIR seguro (${avgRir}). No próximo treino, busque ${targetMinReps} reps com a nova carga.`,
      hasPainAlert: false,
    };
  }

  // Caso ainda esteja construindo repetições dentro da faixa
  const minRepsReached = workingSets.every((s) => s.reps >= targetMinReps);
  if (minRepsReached) {
    return {
      status: 'progredir_reps',
      currentWeightKg,
      suggestedWeightKg: currentWeightKg,
      targetMinReps,
      targetMaxReps,
      completedReps,
      avgRir,
      message: `Progredir Repetições com ${currentWeightKg} kg`,
      detail: `Mantenha a carga de ${currentWeightKg} kg e tente adicionar +1 repetição nas primeiras séries até atingir ${targetMaxReps} reps em todas.`,
      hasPainAlert: false,
    };
  }

  return {
    status: 'manter_carga',
    currentWeightKg,
    suggestedWeightKg: currentWeightKg,
    targetMinReps,
    targetMaxReps,
    completedReps,
    avgRir,
    message: `Consolidar ${currentWeightKg} kg`,
    detail: `Foque na técnica e tente atingir a faixa mínima de ${targetMinReps} reps em todas as séries de trabalho com boa postura.`,
    hasPainAlert: false,
  };
};

/**
 * Agrupa o histórico cronológico de um exercício específico para plotagem de gráficos
 */
export const getExerciseProgressHistory = (
  exerciseId: string,
  sessions: WorkoutSession[]
): ExerciseProgressPoint[] => {
  const points: ExerciseProgressPoint[] = [];

  const completed = [...sessions]
    .filter((s) => s.status === 'concluido')
    .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());

  for (const session of completed) {
    const exLog = session.exercises.find((e) => e.exerciseId === exerciseId);
    if (!exLog) continue;

    const workingSets = exLog.sets.filter((s) => s.isCompleted && s.type === 'trabalho' && s.weightKg > 0);
    if (workingSets.length === 0) continue;

    const maxWeight = Math.max(...workingSets.map((s) => s.weightKg));
    const totalWorkingReps = workingSets.reduce((sum, s) => sum + s.reps, 0);
    const volumeKg = workingSets.reduce((sum, s) => sum + s.weightKg * s.reps, 0);
    const avgRir = Math.round((workingSets.reduce((sum, s) => sum + s.rir, 0) / workingSets.length) * 10) / 10;

    let best1RM = 0;
    for (const set of workingSets) {
      const epley = calculateEstimatedOneRepMax(set.weightKg, set.reps);
      if (epley > best1RM) best1RM = epley;
    }

    const dateObj = new Date(session.startedAt);
    const dateFormatted = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}`;

    points.push({
      date: dateFormatted,
      timestamp: dateObj.getTime(),
      sessionName: session.templateName,
      maxWeightKg: maxWeight,
      estimated1RM: best1RM,
      totalWorkingReps,
      volumeKg,
      avgRir,
      hasPain: !!exLog.painReport && exLog.painReport.intensity > 0,
    });
  }

  return points;
};

/**
 * Calcula o volume semanal ou total distribuído por grupo muscular
 */
export const calculateMuscleVolumeDistribution = (
  sessions: WorkoutSession[],
  catalog: Exercise[],
  daysLimit = 30
): MuscleVolumeSummary[] => {
  const cutoffDate = Date.now() - daysLimit * 24 * 60 * 60 * 1000;
  const recentSessions = sessions.filter(
    (s) => s.status === 'concluido' && new Date(s.startedAt).getTime() >= cutoffDate
  );

  const muscleMap: Partial<Record<MuscleGroup, { workingSets: number; volumeKg: number }>> = {};

  for (const session of recentSessions) {
    for (const exLog of session.exercises) {
      const exMeta = catalog.find((e) => e.id === exLog.exerciseId);
      const primaryMuscle: MuscleGroup = exMeta ? exMeta.primaryMuscle : 'corpo_inteiro';

      if (!muscleMap[primaryMuscle]) {
        muscleMap[primaryMuscle] = { workingSets: 0, volumeKg: 0 };
      }

      for (const set of exLog.sets) {
        if (set.isCompleted && set.type === 'trabalho') {
          muscleMap[primaryMuscle]!.workingSets += 1;
          if (set.weightKg > 0 && set.reps > 0) {
            muscleMap[primaryMuscle]!.volumeKg += set.weightKg * set.reps;
          }
        }
      }
    }
  }

  return (Object.keys(muscleMap) as MuscleGroup[])
    .map((muscle) => ({
      muscle,
      label: MUSCLE_LABELS[muscle] || muscle,
      workingSets: muscleMap[muscle]!.workingSets,
      volumeKg: muscleMap[muscle]!.volumeKg,
    }))
    .sort((a, b) => b.volumeKg - a.volumeKg);
};
