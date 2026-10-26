import { getDB } from './db';
import type { WorkoutSession, SessionExerciseLog, ExerciseSetLog } from '../types/session';
import type { WorkoutTemplate, Exercise } from '../types/workout';

const ACTIVE_SESSION_STORAGE_KEY = 'fenix_active_workout_session';

export const calculateSessionVolume = (exercises: SessionExerciseLog[]): number => {
  let total = 0;
  for (const ex of exercises) {
    for (const set of ex.sets) {
      // Exclui séries de aquecimento do volume efetivo de trabalho!
      if (set.isCompleted && set.type === 'trabalho' && set.weightKg > 0 && set.reps > 0) {
        total += set.weightKg * set.reps;
      }
    }
  }
  return total;
};

export const calculateWorkingSetsCount = (exercises: SessionExerciseLog[]): number => {
  let count = 0;
  for (const ex of exercises) {
    for (const set of ex.sets) {
      if (set.isCompleted && set.type === 'trabalho') {
        count += 1;
      }
    }
  }
  return count;
};

export const startSession = (
  template: WorkoutTemplate,
  exercisesCatalog: Exercise[]
): WorkoutSession => {
  const exercisesLog: SessionExerciseLog[] = template.exercises.map((config) => {
    const exerciseInfo = exercisesCatalog.find((e) => e.id === config.exerciseId);
    const exerciseName = exerciseInfo ? exerciseInfo.name : config.exerciseId.replace(/_/g, ' ');

    const initialSets: ExerciseSetLog[] = [];
    for (let i = 1; i <= config.plannedSets; i++) {
      initialSets.push({
        id: `set_${config.exerciseId}_${i}_${Date.now()}`,
        setNumber: i,
        type: 'trabalho',
        weightKg: 0,
        reps: config.minReps,
        rir: config.targetRir || 3,
        isCompleted: false,
      });
    }

    return {
      exerciseId: config.exerciseId,
      exerciseName,
      sets: initialSets,
      notes: config.notes || '',
      restSeconds: config.restSeconds || 90,
      targetRir: config.targetRir || 3,
    };
  });

  const session: WorkoutSession = {
    id: `session_${Date.now()}`,
    templateId: template.id,
    templateName: template.name,
    startedAt: new Date().toISOString(),
    durationSeconds: 0,
    status: 'em_andamento',
    exercises: exercisesLog,
    totalVolumeKg: 0,
    totalWorkingSets: 0,
    notes: '',
  };

  saveActiveSession(session);
  return session;
};

export const getActiveSession = async (): Promise<WorkoutSession | null> => {
  const local = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local) as WorkoutSession;
      if (parsed && parsed.status === 'em_andamento') {
        return parsed;
      }
    } catch {
      // Ignora erro
    }
  }

  try {
    const db = await getDB();
    const all = await db.getAll('sessions');
    const active = all.find((s) => (s as unknown as WorkoutSession).status === 'em_andamento');
    if (active) {
      return active as unknown as WorkoutSession;
    }
  } catch (err) {
    console.warn('Erro ao consultar sessão ativa no IndexedDB:', err);
  }

  return null;
};

export const saveActiveSession = async (session: WorkoutSession): Promise<void> => {
  const volume = calculateSessionVolume(session.exercises);
  const workingSets = calculateWorkingSetsCount(session.exercises);

  const updated: WorkoutSession = {
    ...session,
    totalVolumeKg: volume,
    totalWorkingSets: workingSets,
  };

  try {
    localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Erro ao persistir sessão ativa no localStorage:', e);
  }

  try {
    const db = await getDB();
    await db.put('sessions', updated as unknown as Record<string, unknown>);
  } catch (err) {
    console.warn('Erro ao persistir sessão ativa no IndexedDB:', err);
  }
};

export const finishSession = async (session: WorkoutSession): Promise<WorkoutSession> => {
  const finishedAt = new Date().toISOString();
  const startedTime = new Date(session.startedAt).getTime();
  const finishedTime = new Date(finishedAt).getTime();
  const duration = Math.max(1, Math.round((finishedTime - startedTime) / 1000));

  const completedSession: WorkoutSession = {
    ...session,
    status: 'concluido',
    finishedAt,
    durationSeconds: duration,
    totalVolumeKg: calculateSessionVolume(session.exercises),
    totalWorkingSets: calculateWorkingSetsCount(session.exercises),
  };

  try {
    localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
  } catch (e) {
    console.warn('Erro ao remover active session key:', e);
  }

  try {
    const db = await getDB();
    await db.put('sessions', completedSession as unknown as Record<string, unknown>);
  } catch (err) {
    console.warn('Erro ao gravar sessão concluída no IndexedDB:', err);
  }

  return completedSession;
};

export const cancelActiveSession = async (sessionId?: string): Promise<void> => {
  try {
    localStorage.removeItem(ACTIVE_SESSION_STORAGE_KEY);
  } catch (e) {
    console.warn('Erro ao remover active session:', e);
  }

  if (sessionId) {
    try {
      const db = await getDB();
      await db.delete('sessions', sessionId);
    } catch (err) {
      console.warn('Erro ao remover sessão no IndexedDB:', err);
    }
  }
};

export const getLastExercisePerformance = async (
  exerciseId: string
): Promise<ExerciseSetLog[] | null> => {
  try {
    const db = await getDB();
    const all = await db.getAll('sessions');
    // Filtra apenas sessões concluídas e ordena da mais recente para a mais antiga
    const completedSessions = (all as unknown as WorkoutSession[])
      .filter((s) => s.status === 'concluido')
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());

    for (const session of completedSessions) {
      const foundExercise = session.exercises.find((e) => e.exerciseId === exerciseId);
      if (foundExercise && foundExercise.sets.some((s) => s.isCompleted)) {
        return foundExercise.sets.filter((s) => s.isCompleted);
      }
    }
  } catch (err) {
    console.warn('Erro ao consultar histórico recente do exercício:', err);
  }

  return null;
};

export const getAllSessions = async (): Promise<WorkoutSession[]> => {
  try {
    const db = await getDB();
    const all = await db.getAll('sessions');
    return (all as unknown as WorkoutSession[]).sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  } catch (err) {
    console.warn('Erro ao carregar lista de sessões:', err);
    return [];
  }
};

export const deleteSession = async (sessionId: string): Promise<void> => {
  try {
    const db = await getDB();
    await db.delete('sessions', sessionId);
  } catch (err) {
    console.warn('Erro ao deletar sessão:', err);
  }
};

