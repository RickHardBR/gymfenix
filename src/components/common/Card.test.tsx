import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { Card } from './Card';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={darkTheme}>{ui}</ThemeProvider>);
};

describe('Card Component', () => {
  it('renderiza o conteúdo interno com sucesso', () => {
    renderWithTheme(
      <Card>
        <h2>Próximo Treino</h2>
        <p>Treino A - Pernas e Peito</p>
      </Card>
    );
    expect(screen.getByText('Próximo Treino')).toBeInTheDocument();
    expect(screen.getByText('Treino A - Pernas e Peito')).toBeInTheDocument();
  });
});
