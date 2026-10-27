import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import App from './App';
import { cancelActiveSession } from './services/sessionService';

vi.mock('recharts', async () => {
  const original = await vi.importActual<Record<string, unknown>>('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 400, height: 260 }}>{children}</div>
    ),
  };
});

describe('App Integration', () => {
  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();
    await cancelActiveSession();
  });

  it('exibe a tela de login como primeira tela quando não há usuário autenticado', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Transforme sua força/i)).toBeInTheDocument();
      expect(screen.getByText(/Acesse sua conta para continuar seus treinos/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^Entrar/i })).toBeInTheDocument();
    });

    // Clica em Continuar Offline para acessar a aplicação
    const skipBtn = screen.getByRole('button', { name: /Continuar Offline/i });
    fireEvent.click(skipBtn);

    await waitFor(() => {
      expect(screen.getByText(/olá, atleta fênix!/i)).toBeInTheDocument();
    });
  });

  it('inicializa e renderiza a tela inicial após o carregamento quando em modo ativo/convidado', async () => {
    sessionStorage.setItem('fenix_guest_mode', 'true');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/fenix/i)).toBeInTheDocument();
      expect(screen.getByText(/olá, atleta fênix!/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/protocolo de retorno seguro ativo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar treino a/i })).toBeInTheDocument();
  });

  it('permite iniciar o Treino A pela tela inicial, registrar e finalizar a sessão', async () => {
    sessionStorage.setItem('fenix_guest_mode', 'true');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /iniciar treino a/i })).toBeInTheDocument();
    });

    const startBtn = await screen.findByRole('button', { name: /iniciar treino a/i });
    fireEvent.click(startBtn);

    // Deve abrir a tela de treino ativo
    const finishBtn = await screen.findByRole('button', { name: /finalizar treino/i }, { timeout: 6000 });
    expect(finishBtn).toBeInTheDocument();
    expect(screen.getByText('Leg Press 45°')).toBeInTheDocument();

    // Finaliza o treino
    fireEvent.click(finishBtn);

    // Modal de resumo
    const completeBtn = await screen.findByRole('button', { name: /concluir e voltar/i });
    expect(completeBtn).toBeInTheDocument();
    fireEvent.click(completeBtn);

    // Retorna para a tela inicial
    expect(await screen.findByText(/olá, atleta fênix!/i)).toBeInTheDocument();
  });

  it('navega entre as abas de Treinos, Exercícios e Configurações corretamente', async () => {
    sessionStorage.setItem('fenix_guest_mode', 'true');
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /treinos/i })).toBeInTheDocument();
    });

    // Navega para Treinos
    const treinosTab = screen.getByRole('tab', { name: /treinos/i });
    fireEvent.click(treinosTab);

    expect(await screen.findByText(/rotina de treinos/i)).toBeInTheDocument();
    expect(await screen.findByText('Treino A')).toBeInTheDocument();
    expect(await screen.findByText('Treino B')).toBeInTheDocument();
    expect(await screen.findByText('Treino C')).toBeInTheDocument();

    // Navega para Exercícios
    const exerciciosTab = screen.getByRole('tab', { name: /exercícios/i });
    fireEvent.click(exerciciosTab);

    expect(await screen.findByText(/biblioteca de exercícios/i)).toBeInTheDocument();
    expect(await screen.findByText('Leg Press 45°')).toBeInTheDocument();

    // Navega para Perfil
    const perfilTab = screen.getByRole('tab', { name: /perfil/i });
    fireEvent.click(perfilTab);

    expect(await screen.findByText(/perfil do atleta/i)).toBeInTheDocument();
    expect(await screen.findByText(/composição corporal real/i)).toBeInTheDocument();

    // Navega para Ajustes
    const configTab = screen.getByRole('tab', { name: /ajustes/i });
    fireEvent.click(configTab);

    expect(await screen.findByText(/ajustes do sistema/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nome do atleta/i)).toBeInTheDocument();

    // Navega para Evolução
    const evolucaoTab = screen.getByRole('tab', { name: /evolução/i });
    fireEvent.click(evolucaoTab);

    expect(await screen.findByText(/evolução & histórico/i)).toBeInTheDocument();
    expect(await screen.findByText(/recomendações de carga/i)).toBeInTheDocument();

    // Volta para o Início
    const homeTab = screen.getByRole('tab', { name: /início/i });
    fireEvent.click(homeTab);

    expect(await screen.findByText(/olá, atleta fênix!/i)).toBeInTheDocument();
  });
});
