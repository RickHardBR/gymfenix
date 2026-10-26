import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { WorkoutEditScreen } from './WorkoutEditScreen';
import { INITIAL_WORKOUTS } from '../../data/initialWorkouts';
import * as AppContextModule from '../../context/AppContext';
import { createMockAppContext } from '../../test/mockAppContext';

describe('WorkoutEditScreen Component', () => {
  it('renderiza os exercícios do treino e permite alterar parâmetros e salvar', async () => {
    const handleBack = vi.fn();
    const handleSaved = vi.fn();
    const showFeedbackMock = vi.fn();
    const workoutA = INITIAL_WORKOUTS[0];

    vi.spyOn(AppContextModule, 'useApp').mockReturnValue(
      createMockAppContext({
        currentTab: 'treinos',
        showFeedback: showFeedbackMock,
      })
    );

    render(
      <ThemeProvider theme={darkTheme}>
        <WorkoutEditScreen workout={workoutA} onBack={handleBack} onSaved={handleSaved} />
      </ThemeProvider>
    );

    expect(screen.getByText(/editar treino a/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nome do treino/i)).toHaveValue('Treino A');

    await waitFor(() => {
      expect(screen.getByText(/exercícios do treino \(6\)/i)).toBeInTheDocument();
    });

    const saveBtn = screen.getByRole('button', { name: /salvar treino/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(handleSaved).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'treino_a',
          name: 'Treino A',
        })
      );
      expect(showFeedbackMock).toHaveBeenCalled();
    });
  });
});
