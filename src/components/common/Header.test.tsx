import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { Header } from './Header';
import * as AppContextModule from '../../context/AppContext';
import { createMockAppContext } from '../../test/mockAppContext';

describe('Header Component', () => {
  it('renderiza o título da aplicação FENIX GYM e o botão de tema', () => {
    const toggleThemeMock = vi.fn();
    vi.spyOn(AppContextModule, 'useApp').mockReturnValue(
      createMockAppContext({
        currentTab: 'inicio',
        toggleTheme: toggleThemeMock,
      })
    );

    render(
      <ThemeProvider theme={darkTheme}>
        <Header />
      </ThemeProvider>
    );

    expect(screen.getByText(/fenix/i)).toBeInTheDocument();
    expect(screen.getByText(/gym/i)).toBeInTheDocument();

    const themeBtn = screen.getByRole('button', { name: /mudar para tema claro/i });
    expect(themeBtn).toBeInTheDocument();

    fireEvent.click(themeBtn);
    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });
});
