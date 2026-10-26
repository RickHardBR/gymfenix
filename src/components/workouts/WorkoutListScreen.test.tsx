import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { WorkoutListScreen } from './WorkoutListScreen';
import * as AppContextModule from '../../context/AppContext';
import { createMockAppContext } from '../../test/mockAppContext';

describe('WorkoutListScreen Component', () => {
  it('renderiza os Treinos A, B e C cadastrados e permite duplicar', async () => {
    const showFeedbackMock = vi.fn();

    vi.spyOn(AppContextModule, 'useApp').mockReturnValue(
      createMockAppContext({
        currentTab: 'treinos',
        showFeedback: showFeedbackMock,
      })
    );

    render(
      <ThemeProvider theme={darkTheme}>
        <WorkoutListScreen />
      </ThemeProvider>
    );

    expect(screen.getByText(/rotina de treinos/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Treino A')).toBeInTheDocument();
      expect(screen.getByText('Treino B')).toBeInTheDocument();
      expect(screen.getByText('Treino C')).toBeInTheDocument();
    });

    const duplicateButtons = screen.getAllByRole('button', { name: /duplicar treino a/i });
    if (duplicateButtons.length > 0) {
      fireEvent.click(duplicateButtons[0]);
      await waitFor(() => {
        expect(showFeedbackMock).toHaveBeenCalled();
      });
    }
  });
});
