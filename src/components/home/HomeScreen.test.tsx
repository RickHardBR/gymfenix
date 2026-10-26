import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { HomeScreen } from './HomeScreen';
import * as AppContextModule from '../../context/AppContext';
import { createMockAppContext } from '../../test/mockAppContext';

describe('HomeScreen Component', () => {
  it('exibe o nome do atleta, protocolo de retorno seguro e botão para iniciar treino', async () => {
    const setCurrentTabMock = vi.fn();
    const showFeedbackMock = vi.fn();
    const startWorkoutMock = vi.fn();

    vi.spyOn(AppContextModule, 'useApp').mockReturnValue(
      createMockAppContext({
        currentTab: 'inicio',
        setCurrentTab: setCurrentTabMock,
        showFeedback: showFeedbackMock,
        startWorkout: startWorkoutMock,
      })
    );

    render(
      <ThemeProvider theme={darkTheme}>
        <HomeScreen />
      </ThemeProvider>
    );

    expect(screen.getByText(/olá, atleta fênix!/i)).toBeInTheDocument();
    expect(screen.getByText(/protocolo de retorno seguro ativo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar treino a/i })).toBeInTheDocument();

    const startBtn = screen.getByRole('button', { name: /iniciar treino a/i });
    fireEvent.click(startBtn);

    await waitFor(() => {
      expect(startWorkoutMock).toHaveBeenCalled();
    });
  });
});
