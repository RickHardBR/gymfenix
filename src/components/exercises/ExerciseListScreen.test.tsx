import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { ExerciseListScreen } from './ExerciseListScreen';
import * as AppContextModule from '../../context/AppContext';
import { createMockAppContext } from '../../test/mockAppContext';

describe('ExerciseListScreen Component', () => {
  it('renderiza os exercícios da biblioteca e permite buscar por nome', async () => {
    vi.spyOn(AppContextModule, 'useApp').mockReturnValue(
      createMockAppContext({
        currentTab: 'exercicios',
      })
    );

    render(
      <ThemeProvider theme={darkTheme}>
        <ExerciseListScreen />
      </ThemeProvider>
    );

    expect(screen.getByText(/biblioteca de exercícios/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Leg Press 45°')).toBeInTheDocument();
      expect(screen.getByText('Supino em Máquina')).toBeInTheDocument();
    });

    const searchInput = screen.getByLabelText(/buscar exercício por nome/i);
    fireEvent.change(searchInput, { target: { value: 'Remada' } });

    expect(screen.getByText('Remada Sentada com Apoio no Peito')).toBeInTheDocument();
    expect(screen.queryByText('Supino em Máquina')).not.toBeInTheDocument();
  });
});
