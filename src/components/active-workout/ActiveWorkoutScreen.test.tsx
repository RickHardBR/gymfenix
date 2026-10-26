import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { ActiveWorkoutScreen } from './ActiveWorkoutScreen';
import { startSession } from '../../services/sessionService';
import { INITIAL_WORKOUTS } from '../../data/initialWorkouts';
import { INITIAL_EXERCISES } from '../../data/initialExercises';
import * as AppContextModule from '../../context/AppContext';
import { createMockAppContext } from '../../test/mockAppContext';

describe('ActiveWorkoutScreen Component', () => {
  it('renderiza o treino ativo e permite preencher carga e concluir uma série', async () => {
    const session = startSession(INITIAL_WORKOUTS[0], INITIAL_EXERCISES);
    const handleFinish = vi.fn();
    const handleCancel = vi.fn();

    vi.spyOn(AppContextModule, 'useApp').mockReturnValue(
      createMockAppContext({
        currentTab: 'treinos',
        activeSession: session,
      })
    );

    render(
      <ThemeProvider theme={darkTheme}>
        <ActiveWorkoutScreen
          session={session}
          onFinishWorkout={handleFinish}
          onCancelWorkout={handleCancel}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Treino A')).toBeInTheDocument();
    expect(screen.getByText('Leg Press 45°')).toBeInTheDocument();

    // Insere peso e repetições na primeira série
    const weightInputs = screen.getAllByLabelText(/carga em kg da série 1/i);
    fireEvent.change(weightInputs[0], { target: { value: '60' } });

    const repInputs = screen.getAllByLabelText(/repetições da série 1/i);
    fireEvent.change(repInputs[0], { target: { value: '12' } });

    // Conclui a série
    const checkButtons = screen.getAllByLabelText(/concluir série 1/i);
    fireEvent.click(checkButtons[0]);

    // Verifica botão de finalizar
    const finishBtn = screen.getByRole('button', { name: /finalizar treino/i });
    fireEvent.click(finishBtn);

    await waitFor(() => {
      expect(screen.getByText(/treino concluído com sucesso!/i)).toBeInTheDocument();
    });
  });

  it('permite abrir o modal de relato de dor e salvar', async () => {
    const session = startSession(INITIAL_WORKOUTS[0], INITIAL_EXERCISES);

    render(
      <ThemeProvider theme={darkTheme}>
        <ActiveWorkoutScreen
          session={session}
          onFinishWorkout={vi.fn()}
          onCancelWorkout={vi.fn()}
        />
      </ThemeProvider>
    );

    const painButtons = screen.getAllByLabelText(/relatar dor ou desconforto neste exercício/i);
    fireEvent.click(painButtons[0]);

    expect(screen.getByText(/segurança e adaptação/i)).toBeInTheDocument();

    const savePainBtn = screen.getByRole('button', { name: /salvar relato de segurança/i });
    fireEvent.click(savePainBtn);

    await waitFor(() => {
      expect(screen.queryByText(/segurança e adaptação/i)).not.toBeInTheDocument();
    });
  });
});
