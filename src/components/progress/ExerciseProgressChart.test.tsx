import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { ExerciseProgressChart } from './ExerciseProgressChart';
import type { Exercise } from '../../types/workout';

// Mock do ResponsiveContainer para o ambiente JSDOM
vi.mock('recharts', async () => {
  const original = await vi.importActual<Record<string, unknown>>('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 400, height: 260 }}>{children}</div>
    ),
  };
});

describe('ExerciseProgressChart Component', () => {
  const mockCatalog: Exercise[] = [
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
  ];

  it('exibe mensagem amigável quando ainda não há dados registrados', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <ExerciseProgressChart sessions={[]} catalog={mockCatalog} />
      </ThemeProvider>
    );

    expect(screen.getByText(/Evolução de Cargas & 1RM Estimado/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Nenhum treino concluído com este exercício ainda/i)
    ).toBeInTheDocument();
  });
});
