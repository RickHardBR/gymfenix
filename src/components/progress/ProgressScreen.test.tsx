import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { ProgressScreen } from './ProgressScreen';
import * as sessionService from '../../services/sessionService';
import * as exerciseService from '../../services/exerciseService';
import * as workoutService from '../../services/workoutService';
import type { WorkoutSession } from '../../types/session';

vi.mock('recharts', async () => {
  const original = await vi.importActual<Record<string, unknown>>('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 400, height: 260 }}>{children}</div>
    ),
  };
});

describe('ProgressScreen Component', () => {
  const mockSessions: WorkoutSession[] = [
    {
      id: 's_test_1',
      templateId: 't1',
      templateName: 'Treino A - Full Body',
      startedAt: '2026-10-25T10:00:00Z',
      status: 'concluido',
      durationSeconds: 2400,
      totalVolumeKg: 850,
      totalWorkingSets: 4,
      exercises: [
        {
          exerciseId: 'leg_press',
          exerciseName: 'Leg Press 45°',
          restSeconds: 120,
          targetRir: 3,
          sets: [
            { id: '1', setNumber: 1, type: 'trabalho', weightKg: 100, reps: 12, rir: 2, isCompleted: true },
            { id: '2', setNumber: 2, type: 'trabalho', weightKg: 100, reps: 12, rir: 2, isCompleted: true },
          ],
        },
      ],
    },
  ];

  beforeEach(() => {
    vi.spyOn(sessionService, 'getAllSessions').mockResolvedValue(mockSessions);
    vi.spyOn(exerciseService, 'getAllExercises').mockResolvedValue([
      {
        id: 'leg_press',
        name: 'Leg Press 45°',
        primaryMuscle: 'quadriceps',
        secondaryMuscles: ['gluteos'],
        equipment: 'maquina',
        type: 'composto',
        difficulty: 'iniciante',
        instructions: [],
        commonMistakes: [],
        equipmentSetup: '',
        alternatives: [],
        safetyWarnings: '',
        createdAt: '',
      },
    ]);
    vi.spyOn(workoutService, 'getAllWorkouts').mockResolvedValue([
      {
        id: 't1',
        name: 'Treino A',
        subtitle: 'Full Body',
        description: 'Teste',
        estimatedDurationMinutes: 50,
        createdAt: '',
        updatedAt: '',
        exercises: [
          {
            exerciseId: 'leg_press',
            order: 1,
            plannedSets: 2,
            minReps: 8,
            maxReps: 12,
            restSeconds: 120,
            targetRir: 3,
          },
        ],
      },
    ]);
  });

  it('renderiza título, recomendações e permite alternar para o histórico', async () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <ProgressScreen />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Evolução & Histórico')).toBeInTheDocument();
    });

    expect(screen.getByText(/Recomendações de Carga/i)).toBeInTheDocument();
    expect(screen.getAllByText('Leg Press 45°').length).toBeGreaterThan(0);

    // Alterna para aba de histórico
    const historyTabBtn = screen.getByRole('button', { name: /Aba de Histórico de Sessões/i });
    fireEvent.click(historyTabBtn);

    expect(screen.getByText('Treino A - Full Body')).toBeInTheDocument();
    expect(screen.getByText(/850 kg levantados/i)).toBeInTheDocument();

    // Abre o modal de detalhes clicando no card da sessão
    const sessionCard = screen.getByText('Treino A - Full Body');
    fireEvent.click(sessionCard);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
