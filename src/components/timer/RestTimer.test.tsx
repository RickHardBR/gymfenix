import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { RestTimer } from './RestTimer';

describe('RestTimer Component', () => {
  it('renderiza o tempo inicial de descanso e permite pausar/retomar', () => {
    const handleClose = vi.fn();

    render(
      <ThemeProvider theme={darkTheme}>
        <RestTimer initialSeconds={90} soundEnabled={false} onClose={handleClose} />
      </ThemeProvider>
    );

    expect(screen.getByText(/tempo de descanso/i)).toBeInTheDocument();
    expect(screen.getByText('1:30')).toBeInTheDocument();

    const pauseBtn = screen.getByRole('button', { name: /pausar/i });
    fireEvent.click(pauseBtn);

    expect(screen.getByRole('button', { name: /retomar/i })).toBeInTheDocument();
  });

  it('permite pular e fechar o cronômetro', () => {
    const handleClose = vi.fn();

    render(
      <ThemeProvider theme={darkTheme}>
        <RestTimer initialSeconds={60} soundEnabled={false} onClose={handleClose} />
      </ThemeProvider>
    );

    const closeBtn = screen.getByRole('button', { name: /fechar cronômetro/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
