import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { DoubleProgressionCard } from './DoubleProgressionCard';
import type { ProgressionRecommendation } from '../../utils/progressionEngine';

describe('DoubleProgressionCard Component', () => {
  it('renderiza corretamente recomendação de aumento de carga', () => {
    const recommendation: ProgressionRecommendation = {
      status: 'aumentar_carga',
      currentWeightKg: 50,
      suggestedWeightKg: 52.5,
      targetMinReps: 8,
      targetMaxReps: 12,
      completedReps: [12, 12],
      avgRir: 2,
      message: 'Meta atingida! Subir para 52.5 kg (+2.5 kg)',
      detail: 'Você completou 12 reps em todas as séries com RIR seguro.',
      hasPainAlert: false,
    };

    render(
      <ThemeProvider theme={darkTheme}>
        <DoubleProgressionCard
          exerciseName="Remada Apoiada no Peito"
          recommendation={recommendation}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Remada Apoiada no Peito')).toBeInTheDocument();
    expect(screen.getByText(/Subir Carga/i)).toBeInTheDocument();
    expect(screen.getByText(/Meta atingida! Subir para 52.5 kg/i)).toBeInTheDocument();
    expect(screen.getByText('52.5 kg')).toBeInTheDocument();
  });

  it('renderiza alerta de cuidado lombar quando há status reduzir_deload_dor', () => {
    const recommendation: ProgressionRecommendation = {
      status: 'reduzir_deload_dor',
      currentWeightKg: 60,
      suggestedWeightKg: 50,
      targetMinReps: 8,
      targetMaxReps: 12,
      completedReps: [8, 8],
      avgRir: 1,
      message: 'Alerta Lombar / Articular Detectado',
      detail: 'Houve relato recente de desconforto. Priorize estabilidade.',
      hasPainAlert: true,
    };

    render(
      <ThemeProvider theme={darkTheme}>
        <DoubleProgressionCard
          exerciseName="Leg Press 45°"
          recommendation={recommendation}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Leg Press 45°')).toBeInTheDocument();
    expect(screen.getByText(/Cuidado Lombar/i)).toBeInTheDocument();
    expect(screen.getByText(/Alerta Lombar \/ Articular Detectado/i)).toBeInTheDocument();
  });
});
