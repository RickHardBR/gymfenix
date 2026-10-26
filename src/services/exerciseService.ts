import { getDB } from './db';
import { INITIAL_EXERCISES } from '../data/initialExercises';
import type { Exercise } from '../types/workout';

const EXERCISES_STORAGE_KEY = 'fenix_exercises_store';

export const getAllExercises = async (): Promise<Exercise[]> => {
  try {
    const db = await getDB();
    const stored = await db.getAll('exercises');
    if (stored && stored.length > 0) {
      return stored;
    }

    // Inicializa os exercícios no IndexedDB se estiver vazio
    const tx = db.transaction('exercises', 'readwrite');
    for (const ex of INITIAL_EXERCISES) {
      await tx.store.put(ex);
    }
    await tx.done;
    return INITIAL_EXERCISES;
  } catch (err) {
    console.warn('Erro ao consultar exercícios no IndexedDB, buscando do localStorage:', err);
  }

  // Fallback LocalStorage
  const local = localStorage.getItem(EXERCISES_STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local) as Exercise[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Ignora erro de parse
    }
  }

  // Salva no fallback
  try {
    localStorage.setItem(EXERCISES_STORAGE_KEY, JSON.stringify(INITIAL_EXERCISES));
  } catch (e) {
    console.warn('Erro ao salvar no localStorage:', e);
  }

  return INITIAL_EXERCISES;
};

export const getExerciseById = async (id: string): Promise<Exercise | undefined> => {
  const exercises = await getAllExercises();
  return exercises.find((e) => e.id === id);
};

export const saveExercise = async (exercise: Exercise): Promise<void> => {
  try {
    const db = await getDB();
    await db.put('exercises', exercise);
  } catch (err) {
    console.warn('Erro ao salvar exercício no IndexedDB:', err);
  }

  // Sincroniza LocalStorage
  try {
    const exercises = await getAllExercises();
    const index = exercises.findIndex((e) => e.id === exercise.id);
    if (index >= 0) {
      exercises[index] = exercise;
    } else {
      exercises.push(exercise);
    }
    localStorage.setItem(EXERCISES_STORAGE_KEY, JSON.stringify(exercises));
  } catch (e) {
    console.warn('Erro ao sincronizar exercício no localStorage:', e);
  }
};

export const deleteExercise = async (id: string): Promise<void> => {
  try {
    const db = await getDB();
    await db.delete('exercises', id);
  } catch (err) {
    console.warn('Erro ao remover exercício no IndexedDB:', err);
  }

  try {
    const exercises = await getAllExercises();
    const filtered = exercises.filter((e) => e.id !== id);
    localStorage.setItem(EXERCISES_STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Erro ao atualizar localStorage após remoção:', e);
  }
};
