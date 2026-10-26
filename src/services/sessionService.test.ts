import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateSessionVolume,
  calculateWorkingSetsCount,
  startSession,
  saveActiveSession,
  getActiveSession,
  finishSession,
  cancelActiveSession,
} from './sessionService';
import { INITIAL_WORKOUTS } from '../data/initialWorkouts';
import { INITIAL_EXERCISES } from '../data/initialExercises';
import type { SessionExerciseLog } from '../types/session';

describe('Session Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('calcula o volume de treino excluindo séries de aquecimento e séries não concluídas', () => {
    const mockExercises: SessionExerciseLog[] = [
      {
        exerciseId: 'supino_maquina',
        exerciseName: 'Supino em Máquina',
        restSeconds: 120,
        targetRir: 3,
        sets: [
          // Aquecimento (não deve entrar no volume de trabalho)
          { id: '1', setNumber: 1, type: 'aquecimento', weightKg: 20, reps: 15, rir: 5, isCompleted: true },
          // Trabalho concluído: 40 * 10 = 400
          { id: '2', setNumber: 2, type: 'trabalho', weightKg: 40, reps: 10, rir: 3, isCompleted: true },
          // Trabalho concluído: 40 * 10 = 400
          { id: '3', setNumber: 3, type: 'trabalho', weightKg: 40, reps: 10, rir: 2, isCompleted: true },
          // Trabalho não concluído (não deve entrar)
          { id: '4', setNumber: 4, type: 'trabalho', weightKg: 40, reps: 10, rir: 2, isCompleted: false },
        ],
      },
    ];

    const volume = calculateSessionVolume(mockExercises);
    expect(volume).toBe(800); // 40*10 + 40*10 = 800

    const workingSets = calculateWorkingSetsCount(mockExercises);
    expect(workingSets).toBe(2);
  });

  it('inicia uma sessão a partir do Treino A e persiste como sessão ativa', async () => {
    const workoutA = INITIAL_WORKOUTS[0];
    const session = startSession(workoutA, INITIAL_EXERCISES);

    expect(session.templateId).toBe('treino_a');
    expect(session.status).toBe('em_andamento');
    expect(session.exercises.length).toBe(6);

    const active = await getActiveSession();
    expect(active).toBeDefined();
    expect(active?.templateName).toBe('Treino A');

    await cancelActiveSession(session.id);
    const afterCancel = await getActiveSession();
    expect(afterCancel).toBeNull();
  });

  it('finaliza uma sessão calculando a duração e volume final', async () => {
    const workoutA = INITIAL_WORKOUTS[0];
    const session = startSession(workoutA, INITIAL_EXERCISES);

    // Marca a primeira série do primeiro exercício
    session.exercises[0].sets[0].weightKg = 50;
    session.exercises[0].sets[0].reps = 10;
    session.exercises[0].sets[0].isCompleted = true;

    await saveActiveSession(session);
    const completed = await finishSession(session);

    expect(completed.status).toBe('concluido');
    expect(completed.totalVolumeKg).toBe(500); // 50 * 10
    expect(completed.totalWorkingSets).toBe(1);
    expect(completed.finishedAt).toBeDefined();

    // A sessão ativa deve ter sido limpa após finalizar
    const active = await getActiveSession();
    expect(active).toBeNull();
  });
});
