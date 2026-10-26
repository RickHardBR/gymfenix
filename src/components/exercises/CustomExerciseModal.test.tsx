import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { CustomExerciseModal } from './CustomExerciseModal';

describe('CustomExerciseModal Component', () => {
  it('permite preencher e salvar um novo exercício', () => {
    const handleClose = vi.fn();
    const handleSave = vi.fn();

    render(
      <ThemeProvider theme={darkTheme}>
        <CustomExerciseModal onClose={handleClose} onSave={handleSave} />
      </ThemeProvider>
    );

    const nameInput = screen.getByLabelText(/nome do exercício \*/i);
    fireEvent.change(nameInput, { target: { value: 'Crucifixo na Máquina' } });

    const submitBtn = screen.getByRole('button', { name: /salvar exercício/i });
    fireEvent.click(submitBtn);

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Crucifixo na Máquina',
        isCustom: true,
      })
    );
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
