import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { BottomNav } from './BottomNav';
import * as AppContextModule from '../../context/AppContext';
import { createMockAppContext } from '../../test/mockAppContext';

describe('BottomNav Component', () => {
  it('renderiza todos os itens de navegação principal e responde ao clique', () => {
    const setCurrentTabMock = vi.fn();
    vi.spyOn(AppContextModule, 'useApp').mockReturnValue(
      createMockAppContext({
        currentTab: 'inicio',
        setCurrentTab: setCurrentTabMock,
      })
    );

    render(
      <ThemeProvider theme={darkTheme}>
        <BottomNav />
      </ThemeProvider>
    );

    expect(screen.getByRole('tab', { name: /início/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /treinos/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /exercícios/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /evolução/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /configurações/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: /configurações/i }));
    expect(setCurrentTabMock).toHaveBeenCalledWith('configuracoes');
  });
});
