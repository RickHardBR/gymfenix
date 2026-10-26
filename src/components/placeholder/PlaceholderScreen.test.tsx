import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { PlaceholderScreen } from './PlaceholderScreen';
import * as AppContextModule from '../../context/AppContext';
import { createMockAppContext } from '../../test/mockAppContext';

describe('PlaceholderScreen Component', () => {
  it('renderiza os detalhes do módulo de treinos', () => {
    vi.spyOn(AppContextModule, 'useApp').mockReturnValue(
      createMockAppContext({
        currentTab: 'treinos',
      })
    );

    render(
      <ThemeProvider theme={darkTheme}>
        <PlaceholderScreen tab="treinos" />
      </ThemeProvider>
    );

    expect(screen.getByText(/módulo de treinos a, b e c/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voltar para a tela inicial/i })).toBeInTheDocument();
  });
});
