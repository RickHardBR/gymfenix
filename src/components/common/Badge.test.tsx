import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('renderiza o rótulo da badge', () => {
    render(
      <ThemeProvider theme={darkTheme}>
        <Badge variant="primary">Full Body A</Badge>
      </ThemeProvider>
    );
    expect(screen.getByText('Full Body A')).toBeInTheDocument();
  });
});
