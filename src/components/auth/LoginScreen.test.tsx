import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { LoginScreen } from './LoginScreen';
import { useApp } from '../../context/AppContext';
import { createMockAppContext } from '../../test/mockAppContext';
import * as authService from '../../services/authService';

vi.mock('../../context/AppContext', () => ({
  useApp: vi.fn(),
}));

vi.mock('../../services/authService', () => ({
  signInWithEmail: vi.fn(),
  signUpWithEmail: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  verifyEmailOtp: vi.fn(),
  resendVerificationEmail: vi.fn(),
}));

describe('LoginScreen Component', () => {
  it('renderiza os títulos principais, campos de e-mail e senha e o botão Entrar', () => {
    vi.mocked(useApp).mockReturnValue(createMockAppContext({}));

    render(
      <ThemeProvider theme={darkTheme}>
        <LoginScreen />
      </ThemeProvider>
    );

    expect(screen.getByText(/Transforme sua força/i)).toBeInTheDocument();
    expect(screen.getByText(/Acesse sua conta para continuar seus treinos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail ou Usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Senha$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Entrar/i })).toBeInTheDocument();
  });

  it('permite alternar para modo de cadastro ao clicar em Cadastre-se', () => {
    vi.mocked(useApp).mockReturnValue(createMockAppContext({}));

    render(
      <ThemeProvider theme={darkTheme}>
        <LoginScreen />
      </ThemeProvider>
    );

    const switchBtn = screen.getByRole('button', { name: /Cadastre-se/i });
    fireEvent.click(switchBtn);

    expect(screen.getByLabelText(/Nome Completo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Criar Minha Conta/i })).toBeInTheDocument();
  });

  it('permite alternar a visibilidade da senha entre texto e password', () => {
    vi.mocked(useApp).mockReturnValue(createMockAppContext({}));

    render(
      <ThemeProvider theme={darkTheme}>
        <LoginScreen />
      </ThemeProvider>
    );

    const passwordInput = screen.getByLabelText(/^Senha$/i);
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleBtn = screen.getByRole('button', { name: /Exibir senha/i });
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');

    const hideBtn = screen.getByRole('button', { name: /Ocultar senha/i });
    fireEvent.click(hideBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('submete credenciais e chama signInWithEmail', async () => {
    const onSuccessMock = vi.fn();
    const mockSyncWithCloud = vi.fn().mockResolvedValue(undefined);

    vi.mocked(useApp).mockReturnValue(
      createMockAppContext({
        syncWithCloud: mockSyncWithCloud,
      })
    );
    vi.mocked(authService.signInWithEmail).mockResolvedValue({} as any);

    render(
      <ThemeProvider theme={darkTheme}>
        <LoginScreen onSuccess={onSuccessMock} />
      </ThemeProvider>
    );

    fireEvent.change(screen.getByLabelText(/E-mail ou Usuário/i), {
      target: { value: 'atleta@fenix.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Senha$/i), {
      target: { value: 'senha123' },
    });

    fireEvent.click(screen.getByRole('button', { name: /^Entrar/i }));

    await waitFor(() => {
      expect(authService.signInWithEmail).toHaveBeenCalledWith('atleta@fenix.com', 'senha123');
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });

  it('permite continuar offline quando fornecido onContinueOffline', () => {
    const onContinueOfflineMock = vi.fn();
    vi.mocked(useApp).mockReturnValue(createMockAppContext({}));

    render(
      <ThemeProvider theme={darkTheme}>
        <LoginScreen onContinueOffline={onContinueOfflineMock} />
      </ThemeProvider>
    );

    const offlineBtn = screen.getByRole('button', { name: /Continuar Offline/i });
    fireEvent.click(offlineBtn);
    expect(onContinueOfflineMock).toHaveBeenCalled();
  });
});
