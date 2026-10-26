import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { INITIAL_EXERCISES } from '../../data/initialExercises';

describe('ExerciseDetailModal Component', () => {
  it('renderiza os detalhes de execução do Leg Press 45° e fecha ao clicar', () => {
    const handleClose = vi.fn();
    const exercise = INITIAL_EXERCISES[0];

    render(
      <ThemeProvider theme={darkTheme}>
        <ExerciseDetailModal exercise={exercise} onClose={handleClose} />
      </ThemeProvider>
    );

    expect(screen.getByText('Leg Press 45°')).toBeInTheDocument();
    expect(screen.getByText(/instruções de execução/i)).toBeInTheDocument();
    expect(screen.getByText(/segurança e coluna:/i)).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /fechar detalhes/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
