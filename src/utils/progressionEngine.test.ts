import { describe, it, expect } from 'vitest';
import {
  calculateEstimatedOneRepMax,
  analyzeDoubleProgression,
  getExerciseProgressHistory,
  calculateMuscleVolumeDistribution,
} from './progressionEngine';
import type { WorkoutSession } from '../types/session';
import type { Exercise } from '../types/workout';

describe('ProgressionEngine', () => {
  describe('calculateEstimatedOneRepMax', () => {
    it('retorna a própria carga para 1 repetição', () => {
      expect(calculateEstimatedOneRepMax(100, 1)).toBe(100);
    });

    it('calcula 1RM estimado corretamente para múltiplas repetições', () => {
      // 80kg x 10 reps: 80 * (1 + 10/30) = 80 * 1.3333 = 106.7kg
      expect(calculateEstimatedOneRepMax(80, 10)).toBe(106.7);
      expect(calculateEstimatedOneRepMax(0, 10)).toBe(0);
    });
  });

  describe('analyzeDoubleProgression', () => {
    it('retorna dados_insuficientes se não houver histórico para o exercício', () => {
      const rec = analyzeDoubleProgression('ex1', 8, 12, []);
      expect(rec.status).toBe('dados_insuficientes');
      expect(rec.hasPainAlert).toBe(false);
    });

    it('recomenda aumento de carga quando o atleta bate o teto em todas as séries de trabalho', () => {
      const mockSessions: WorkoutSession[] = [
        {
          id: 's1',
          templateId: 't1',
          templateName: 'Treino A',
          startedAt: '2026-10-25T10:00:00Z',
          status: 'concluido',
          durationSeconds: 3600,
          totalVolumeKg: 1000,
          totalWorkingSets: 2,
          exercises: [
            {
              exerciseId: 'remada_peito',
              exerciseName: 'Remada Apoiada no Peito',
              restSeconds: 90,
              targetRir: 2,
              sets: [
                { id: '1', setNumber: 1, type: 'trabalho', weightKg: 50, reps: 12, rir: 2, isCompleted: true },
                { id: '2', setNumber: 2, type: 'trabalho', weightKg: 50, reps: 12, rir: 2, isCompleted: true },
              ],
            },
          ],
        },
      ];

      const rec = analyzeDoubleProgression('remada_peito', 8, 12, mockSessions);
      expect(rec.status).toBe('aumentar_carga');
      expect(rec.suggestedWeightKg).toBe(52.5); // >= 40kg -> +2.5kg
      expect(rec.hasPainAlert).toBe(false);
    });

    it('recomenda progredir reps quando nem todas as séries atingiram o limite superior', () => {
      const mockSessions: WorkoutSession[] = [
        {
          id: 's1',
          templateId: 't1',
          templateName: 'Treino A',
          startedAt: '2026-10-25T10:00:00Z',
          status: 'concluido',
          durationSeconds: 3600,
          totalVolumeKg: 1000,
          totalWorkingSets: 2,
          exercises: [
            {
              exerciseId: 'leg_press',
              exerciseName: 'Leg Press 45',
              restSeconds: 120,
              targetRir: 3,
              sets: [
                { id: '1', setNumber: 1, type: 'trabalho', weightKg: 120, reps: 12, rir: 2, isCompleted: true },
                { id: '2', setNumber: 2, type: 'trabalho', weightKg: 120, reps: 10, rir: 2, isCompleted: true },
              ],
            },
          ],
        },
      ];

      const rec = analyzeDoubleProgression('leg_press', 8, 12, mockSessions);
      expect(rec.status).toBe('progredir_reps');
      expect(rec.suggestedWeightKg).toBe(120);
      expect(rec.hasPainAlert).toBe(false);
    });

    it('recomenda deload ou cautela se houver relato de dor lombar ou articular', () => {
      const mockSessions: WorkoutSession[] = [
        {
          id: 's1',
          templateId: 't1',
          templateName: 'Treino A',
          startedAt: '2026-10-25T10:00:00Z',
          status: 'concluido',
          durationSeconds: 3600,
          totalVolumeKg: 1000,
          totalWorkingSets: 2,
          exercises: [
            {
              exerciseId: 'remada_peito',
              exerciseName: 'Remada Apoiada no Peito',
              restSeconds: 90,
              targetRir: 3,
              painReport: {
                region: 'Lombar',
                intensity: 5,
                stopped: false,
                notes: 'Sensação de fisgada',
              },
              sets: [
                { id: '1', setNumber: 1, type: 'trabalho', weightKg: 60, reps: 12, rir: 2, isCompleted: true },
                { id: '2', setNumber: 2, type: 'trabalho', weightKg: 60, reps: 12, rir: 2, isCompleted: true },
              ],
            },
          ],
        },
      ];

      const rec = analyzeDoubleProgression('remada_peito', 8, 12, mockSessions);
      expect(rec.status).toBe('reduzir_deload_dor');
      expect(rec.hasPainAlert).toBe(true);
      expect(rec.suggestedWeightKg).toBeLessThan(60);
    });
  });

  describe('getExerciseProgressHistory', () => {
    it('retorna pontos cronológicos com 1RM e tonelagem', () => {
      const mockSessions: WorkoutSession[] = [
        {
          id: 's1',
          templateId: 't1',
          templateName: 'Treino A',
          startedAt: '2026-10-20T10:00:00Z',
          status: 'concluido',
          durationSeconds: 3600,
          totalVolumeKg: 500,
          totalWorkingSets: 1,
          exercises: [
            {
              exerciseId: 'supino',
              exerciseName: 'Supino Reto',
              restSeconds: 90,
              targetRir: 2,
              sets: [{ id: '1', setNumber: 1, type: 'trabalho', weightKg: 60, reps: 10, rir: 2, isCompleted: true }],
            },
          ],
        },
      ];

      const history = getExerciseProgressHistory('supino', mockSessions);
      expect(history.length).toBe(1);
      expect(history[0].maxWeightKg).toBe(60);
      expect(history[0].estimated1RM).toBe(80); // 60 * (1 + 10/30) = 80
      expect(history[0].volumeKg).toBe(600);
    });
  });

  describe('calculateMuscleVolumeDistribution', () => {
    it('calcula o total de séries e volume por grupo muscular', () => {
      const mockCatalog: Exercise[] = [
        {
          id: 'supino',
          name: 'Supino',
          primaryMuscle: 'peito',
          secondaryMuscles: ['triceps'],
          equipment: 'halteres',
          type: 'composto',
          difficulty: 'intermediario',
          instructions: [],
          commonMistakes: [],
          equipmentSetup: '',
          alternatives: [],
          safetyWarnings: '',
          createdAt: '',
        },
      ];

      const mockSessions: WorkoutSession[] = [
        {
          id: 's1',
          templateId: 't1',
          templateName: 'Treino A',
          startedAt: new Date().toISOString(),
          status: 'concluido',
          durationSeconds: 3600,
          totalVolumeKg: 600,
          totalWorkingSets: 1,
          exercises: [
            {
              exerciseId: 'supino',
              exerciseName: 'Supino',
              restSeconds: 90,
              targetRir: 2,
              sets: [{ id: '1', setNumber: 1, type: 'trabalho', weightKg: 30, reps: 10, rir: 2, isCompleted: true }],
            },
          ],
        },
      ];

      const dist = calculateMuscleVolumeDistribution(mockSessions, mockCatalog);
      expect(dist.length).toBe(1);
      expect(dist[0].muscle).toBe('peito');
      expect(dist[0].workingSets).toBe(1);
      expect(dist[0].volumeKg).toBe(300);
    });
  });
});
