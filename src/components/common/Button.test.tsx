import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { Button } from './Button';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={darkTheme}>{ui}</ThemeProvider>);
};

describe('Button Component', () => {
  it('renderiza o texto corretamente', () => {
    renderWithTheme(<Button>Iniciar Treino</Button>);
    expect(screen.getByRole('button', { name: /iniciar treino/i })).toBeInTheDocument();
  });

  it('chama onClick quando clicado', () => {
    const handleClick = vi.fn();
    renderWithTheme(<Button onClick={handleClick}>Avançar</Button>);
    const button = screen.getByRole('button', { name: /avançar/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('não dispara clique quando desabilitado', () => {
    const handleClick = vi.fn();
    renderWithTheme(
      <Button disabled onClick={handleClick}>
        Desabilitado
      </Button>
    );
    const button = screen.getByRole('button', { name: /desabilitado/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
