import { describe, it, expect, beforeEach } from 'vitest';
import {
  getAllWorkouts,
  getWorkoutById,
  duplicateWorkout,
  substituteWorkoutExercise,
} from './workoutService';

describe('Workout Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('retorna os treinos iniciais A, B e C', async () => {
    const workouts = await getAllWorkouts();
    expect(workouts.length).toBeGreaterThanOrEqual(3);
    expect(workouts.some((w) => w.id === 'treino_a')).toBe(true);
    expect(workouts.some((w) => w.id === 'treino_b')).toBe(true);
    expect(workouts.some((w) => w.id === 'treino_c')).toBe(true);
  });

  it('permite buscar o Treino A e verificar seus exercícios planejados', async () => {
    const workoutA = await getWorkoutById('treino_a');
    expect(workoutA).toBeDefined();
    expect(workoutA?.name).toBe('Treino A');
    expect(workoutA?.exercises.length).toBe(6);
    expect(workoutA?.exercises[0].exerciseId).toBe('leg_press_45');
    expect(workoutA?.exercises[0].plannedSets).toBe(2);
  });

  it('permite duplicar um treino', async () => {
    const copy = await duplicateWorkout('treino_a');
    expect(copy.id).toContain('treino_copia_');
    expect(copy.name).toContain('Cópia');
    expect(copy.exercises.length).toBe(6);
  });

  it('permite substituir um exercício em um treino', async () => {
    const updated = await substituteWorkoutExercise('treino_a', 'mesa_flexora', 'flexora_sentada');
    expect(updated).toBeDefined();
    expect(updated?.exercises.some((e) => e.exerciseId === 'flexora_sentada')).toBe(true);
    expect(updated?.exercises.some((e) => e.exerciseId === 'mesa_flexora')).toBe(false);
  });
});
