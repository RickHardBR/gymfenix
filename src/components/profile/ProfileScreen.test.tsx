import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { ProfileScreen } from './ProfileScreen';
import * as AppContextModule from '../../context/AppContext';
import { createMockAppContext } from '../../test/mockAppContext';

describe('ProfileScreen Component', () => {
  it('permite visualizar e alterar os dados do perfil do atleta', async () => {
    const updateProfileMock = vi.fn();
    const updateSettingsMock = vi.fn();

    vi.spyOn(AppContextModule, 'useApp').mockReturnValue(
      createMockAppContext({
        currentTab: 'configuracoes',
        updateProfile: updateProfileMock,
        updateSettings: updateSettingsMock,
      })
    );

    render(
      <ThemeProvider theme={darkTheme}>
        <ProfileScreen />
      </ThemeProvider>
    );

    expect(screen.getByText(/perfil e configurações/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nome do atleta/i)).toHaveValue('Atleta Fênix');
    expect(screen.getByLabelText(/objetivo principal/i)).toHaveValue(
      'Desenvolver força e massa muscular e melhorar a composição corporal'
    );

    const nameInput = screen.getByLabelText(/nome do atleta/i);
    fireEvent.change(nameInput, { target: { value: 'Rick Hard' } });

    const submitBtn = screen.getByRole('button', { name: /salvar alterações do perfil/i });
    fireEvent.click(submitBtn);

    expect(updateProfileMock).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Rick Hard',
      })
    );
  });
});
