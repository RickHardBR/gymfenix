import { getDB } from './db';
import { INITIAL_WORKOUTS } from '../data/initialWorkouts';
import type { WorkoutTemplate } from '../types/workout';

const WORKOUTS_STORAGE_KEY = 'fenix_workouts_store';

export const getAllWorkouts = async (): Promise<WorkoutTemplate[]> => {
  try {
    const db = await getDB();
    const stored = await db.getAll('workoutTemplates');
    if (stored && stored.length > 0) {
      return stored;
    }

    // Inicializa treinos iniciais A, B e C
    const tx = db.transaction('workoutTemplates', 'readwrite');
    for (const w of INITIAL_WORKOUTS) {
      await tx.store.put(w);
    }
    await tx.done;
    return INITIAL_WORKOUTS;
  } catch (err) {
    console.warn('Erro ao consultar treinos no IndexedDB, buscando do localStorage:', err);
  }

  // Fallback LocalStorage
  const local = localStorage.getItem(WORKOUTS_STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local) as WorkoutTemplate[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Ignora erro
    }
  }

  try {
    localStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(INITIAL_WORKOUTS));
  } catch (e) {
    console.warn('Erro ao salvar treinos no localStorage:', e);
  }

  return INITIAL_WORKOUTS;
};

export const getWorkoutById = async (id: string): Promise<WorkoutTemplate | undefined> => {
  const workouts = await getAllWorkouts();
  return workouts.find((w) => w.id === id);
};

export const saveWorkout = async (workout: WorkoutTemplate): Promise<void> => {
  const updated: WorkoutTemplate = {
    ...workout,
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await getDB();
    await db.put('workoutTemplates', updated);
  } catch (err) {
    console.warn('Erro ao salvar treino no IndexedDB:', err);
  }

  try {
    const workouts = await getAllWorkouts();
    const index = workouts.findIndex((w) => w.id === updated.id);
    if (index >= 0) {
      workouts[index] = updated;
    } else {
      workouts.push(updated);
    }
    localStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(workouts));
  } catch (e) {
    console.warn('Erro ao sincronizar treinos no localStorage:', e);
  }
};

export const deleteWorkout = async (id: string): Promise<void> => {
  try {
    const db = await getDB();
    await db.delete('workoutTemplates', id);
  } catch (err) {
    console.warn('Erro ao remover treino no IndexedDB:', err);
  }

  try {
    const workouts = await getAllWorkouts();
    const filtered = workouts.filter((w) => w.id !== id);
    localStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Erro ao atualizar localStorage após remoção de treino:', e);
  }
};

export const duplicateWorkout = async (id: string): Promise<WorkoutTemplate> => {
  const original = await getWorkoutById(id);
  if (!original) {
    throw new Error('Treino não encontrado para duplicação');
  }

  const newWorkout: WorkoutTemplate = {
    ...original,
    id: `treino_copia_${Date.now()}`,
    name: `${original.name} (Cópia)`,
    isCustom: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await saveWorkout(newWorkout);
  return newWorkout;
};

export const substituteWorkoutExercise = async (
  workoutId: string,
  oldExerciseId: string,
  newExerciseId: string
): Promise<WorkoutTemplate | undefined> => {
  const workout = await getWorkoutById(workoutId);
  if (!workout) return undefined;

  const updatedExercises = workout.exercises.map((item) => {
    if (item.exerciseId === oldExerciseId) {
      return {
        ...item,
        exerciseId: newExerciseId,
      };
    }
    return item;
  });

  const updatedWorkout: WorkoutTemplate = {
    ...workout,
    exercises: updatedExercises,
    updatedAt: new Date().toISOString(),
  };

  await saveWorkout(updatedWorkout);
  return updatedWorkout;
};
