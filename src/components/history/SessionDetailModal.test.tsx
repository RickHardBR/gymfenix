import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { SessionDetailModal } from './SessionDetailModal';
import type { WorkoutSession } from '../../types/session';

describe('SessionDetailModal Component', () => {
  const mockSession: WorkoutSession = {
    id: 's1',
    templateId: 't1',
    templateName: 'Treino A - Full Body',
    startedAt: '2026-10-25T10:00:00Z',
    finishedAt: '2026-10-25T10:45:00Z',
    durationSeconds: 2700,
    status: 'concluido',
    totalVolumeKg: 1250,
    totalWorkingSets: 4,
    exercises: [
      {
        exerciseId: 'leg_press',
        exerciseName: 'Leg Press 45°',
        restSeconds: 120,
        targetRir: 3,
        sets: [
          { id: '1', setNumber: 1, type: 'trabalho', weightKg: 100, reps: 10, rir: 3, isCompleted: true },
        ],
      },
    ],
  };

  it('renderiza os dados da sessão e dispara onClose ao clicar no botão fechar', () => {
    const handleClose = vi.fn();

    render(
      <ThemeProvider theme={darkTheme}>
        <SessionDetailModal session={mockSession} onClose={handleClose} />
      </ThemeProvider>
    );

    expect(screen.getByText('Treino A - Full Body')).toBeInTheDocument();
    expect(screen.getByText('45 min')).toBeInTheDocument();
    expect(screen.getByText('1250 kg')).toBeInTheDocument();
    expect(screen.getByText('Leg Press 45°')).toBeInTheDocument();

    const closeButtons = screen.getAllByRole('button', { name: /fechar/i });
    fireEvent.click(closeButtons[0]);
    expect(handleClose).toHaveBeenCalled();
  });
});
