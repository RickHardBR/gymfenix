import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { AuthModal } from './AuthModal';
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
}));

describe('AuthModal Component', () => {
  it('não renderiza quando isAuthModalOpen é false', () => {
    vi.mocked(useApp).mockReturnValue(createMockAppContext({ isAuthModalOpen: false }));
    const { container } = render(
      <ThemeProvider theme={darkTheme}>
        <AuthModal />
      </ThemeProvider>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renderiza formulário de login quando aberto', () => {
    vi.mocked(useApp).mockReturnValue(createMockAppContext({ isAuthModalOpen: true }));
    render(
      <ThemeProvider theme={darkTheme}>
        <AuthModal />
      </ThemeProvider>
    );

    expect(screen.getByText('Nuvem Fênix (Supabase)')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Entrar e Sincronizar' })).toBeInTheDocument();
  });

  it('permite alternar para a aba Criar Conta', () => {
    vi.mocked(useApp).mockReturnValue(createMockAppContext({ isAuthModalOpen: true }));
    render(
      <ThemeProvider theme={darkTheme}>
        <AuthModal />
      </ThemeProvider>
    );

    const registerTab = screen.getByRole('button', { name: 'Criar Conta' });
    fireEvent.click(registerTab);

    expect(screen.getByLabelText('Nome Completo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Criar Minha Conta' })).toBeInTheDocument();
  });

  it('chama signInWithEmail ao submeter o login', async () => {
    const mockSyncWithCloud = vi.fn().mockResolvedValue(undefined);
    const mockCloseAuthModal = vi.fn();
    vi.mocked(useApp).mockReturnValue(
      createMockAppContext({
        isAuthModalOpen: true,
        closeAuthModal: mockCloseAuthModal,
        syncWithCloud: mockSyncWithCloud,
      })
    );
    vi.mocked(authService.signInWithEmail).mockResolvedValue({} as any);

    render(
      <ThemeProvider theme={darkTheme}>
        <AuthModal />
      </ThemeProvider>
    );

    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'teste@fenix.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Entrar e Sincronizar' }));

    await waitFor(() => {
      expect(authService.signInWithEmail).toHaveBeenCalledWith('teste@fenix.com', 'senha123');
      expect(mockCloseAuthModal).toHaveBeenCalled();
    });
  });

  it('exibe tela de validação em tempo real quando o cadastro exige confirmação de e-mail', async () => {
    vi.mocked(useApp).mockReturnValue(
      createMockAppContext({
        isAuthModalOpen: true,
      })
    );
    vi.mocked(authService.signUpWithEmail).mockResolvedValue({
      user: { id: 'u1' } as any,
      session: null,
      needsEmailConfirmation: true,
    });

    render(
      <ThemeProvider theme={darkTheme}>
        <AuthModal />
      </ThemeProvider>
    );

    // Muda para cadastro
    fireEvent.click(screen.getByRole('button', { name: 'Criar Conta' }));
    fireEvent.change(screen.getByLabelText('Nome Completo'), { target: { value: 'Atleta Fênix' } });
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'novo@fenix.com' } });
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: 'Criar Minha Conta' }));

    await waitFor(() => {
      expect(screen.getByText('Confirme seu E-mail')).toBeInTheDocument();
      expect(screen.getByText('novo@fenix.com')).toBeInTheDocument();
      expect(screen.getByText(/Aguardando validação em tempo real/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Digite o código de 6 dígitos/i)).toBeInTheDocument();
    });
  });
});
