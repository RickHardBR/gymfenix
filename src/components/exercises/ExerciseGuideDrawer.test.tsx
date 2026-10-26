import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect, vi } from 'vitest';
import { ExerciseGuideDrawer } from './ExerciseGuideDrawer';
import { darkTheme } from '../../styles/theme';
import type { Exercise } from '../../types/workout';

const mockExercise: Exercise = {
  id: 'ex-1',
  name: 'Supino Reto com Barra',
  primaryMuscle: 'peito',
  secondaryMuscles: ['triceps', 'ombros'],
  equipment: 'barra',
  type: 'composto',
  difficulty: 'intermediario',
  instructions: [
    'Deite-se no banco com os pés firmes no chão.',
    'Abaixe a barra de forma controlada até o meio do peito.',
    'Empurre a barra para cima até a extensão dos braços.',
  ],
  commonMistakes: [
    'Tirar a lombar do banco excessivamente.',
    'Bater a barra no peito.',
  ],
  equipmentSetup: 'Ajuste os suportes da barra na altura dos olhos.',
  alternatives: [],
  safetyWarnings: 'Mantenha os punhos alinhados com o antebraço.',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={darkTheme}>{ui}</ThemeProvider>);
};

describe('ExerciseGuideDrawer Component', () => {
  it('não renderiza nada quando isOpen é false', () => {
    const { container } = renderWithTheme(
      <ExerciseGuideDrawer
        exercise={mockExercise}
        isOpen={false}
        onClose={vi.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renderiza título do exercício e badges quando isOpen é true', () => {
    renderWithTheme(
      <ExerciseGuideDrawer
        exercise={mockExercise}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText('Supino Reto com Barra')).toBeInTheDocument();
    expect(screen.getByText('peito')).toBeInTheDocument();
    expect(screen.getByText('barra')).toBeInTheDocument();
  });

  it('permite alternar entre as abas Cadência e Posição A vs B', () => {
    renderWithTheme(
      <ExerciseGuideDrawer
        exercise={mockExercise}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    // Inicialmente na aba de cadência
    expect(screen.getByText(/Cadência & Movimento/i)).toBeInTheDocument();

    // Clica na aba Posição A vs B
    const tabPosicao = screen.getByRole('button', { name: /Posição A vs\. B/i });
    fireEvent.click(tabPosicao);

    expect(screen.getByText(/Alongamento Controlado/i)).toBeInTheDocument();
    expect(screen.getByText(/Pico de Contração/i)).toBeInTheDocument();
  });

  it('renderiza os checklists de postura correta, erros e setup de equipamento', () => {
    renderWithTheme(
      <ExerciseGuideDrawer
        exercise={mockExercise}
        isOpen={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText(/Checklist de Execução & Postura/i)).toBeInTheDocument();
    expect(screen.getByText(/Atenção Lombar & O que Evitar/i)).toBeInTheDocument();
    expect(screen.getByText(/Setup & Regulagem do Equipamento/i)).toBeInTheDocument();
    expect(screen.getByText(/Tirar a lombar do banco excessivamente/i)).toBeInTheDocument();
    expect(screen.getByText(/Ajuste os suportes da barra na altura dos olhos/i)).toBeInTheDocument();
  });

  it('chama onClose ao clicar no botão fechar', () => {
    const onCloseMock = vi.fn();
    renderWithTheme(
      <ExerciseGuideDrawer
        exercise={mockExercise}
        isOpen={true}
        onClose={onCloseMock}
      />
    );

    const closeBtn = screen.getByRole('button', { name: /fechar guia/i });
    fireEvent.click(closeBtn);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
