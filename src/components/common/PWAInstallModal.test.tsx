import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { PWAInstallModal } from './PWAInstallModal';

describe('PWAInstallModal Component', () => {
  it('renderiza os benefícios da instalação em tela cheia quando aberto', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <PWAInstallModal
          isOpen={true}
          onClose={vi.fn()}
          onInstall={vi.fn()}
          isIOS={false}
          isInstallable={true}
          onToggleFullscreen={vi.fn()}
        />
      </ThemeProvider>
    );

    expect(screen.getByText(/Instalar no Celular/i)).toBeInTheDocument();
    expect(screen.getByText(/Tela Cheia Total:/i)).toBeInTheDocument();
    expect(screen.getByText(/100% Offline:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Instalar Aplicativo Agora/i })).toBeInTheDocument();
  });

  it('exibe instruções específicas do Safari quando isIOS for true', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <PWAInstallModal
          isOpen={true}
          onClose={vi.fn()}
          onInstall={vi.fn()}
          isIOS={true}
          isInstallable={false}
          onToggleFullscreen={vi.fn()}
        />
      </ThemeProvider>
    );

    expect(screen.getByText(/Como instalar no iPhone \/ iPad \(Safari\):/i)).toBeInTheDocument();
    expect(screen.getByText(/Adicionar à Tela de Início/i)).toBeInTheDocument();
  });

  it('permite fechar o modal ao clicar no botão Fechar', () => {
    const onCloseMock = vi.fn();
    render(
      <ThemeProvider theme={darkTheme}>
        <PWAInstallModal
          isOpen={true}
          onClose={onCloseMock}
          onInstall={vi.fn()}
          isIOS={false}
          isInstallable={true}
          onToggleFullscreen={vi.fn()}
        />
      </ThemeProvider>
    );

    const closeBtn = screen.getByLabelText('Fechar');
    fireEvent.click(closeBtn);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
