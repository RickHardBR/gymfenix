import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { MuscleVolumeChart } from './MuscleVolumeChart';

vi.mock('recharts', async () => {
  const original = await vi.importActual<Record<string, unknown>>('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div style={{ width: 400, height: 240 }}>{children}</div>
    ),
  };
});

describe('MuscleVolumeChart Component', () => {
  it('exibe mensagem quando não há volume nos últimos 30 dias', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <MuscleVolumeChart sessions={[]} catalog={[]} />
      </ThemeProvider>
    );

    expect(screen.getByText(/Volume por Grupo Muscular/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Nenhum volume registrado nos últimos 30 dias/i)
    ).toBeInTheDocument();
  });
});
