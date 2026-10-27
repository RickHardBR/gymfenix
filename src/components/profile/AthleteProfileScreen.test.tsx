import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from '../../styles/theme';
import { AthleteProfileScreen } from './AthleteProfileScreen';
import * as AppContextModule from '../../context/AppContext';
import { createMockAppContext } from '../../test/mockAppContext';

describe('AthleteProfileScreen Component', () => {
  it('renderiza título, biometria e métricas avançadas de gordura corporal', () => {
    const updateProfileMock = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(AppContextModule, 'useApp').mockReturnValue(
      createMockAppContext({
        profile: {
          name: 'Atleta Teste',
          nickname: 'Fenômeno',
          gender: 'masculino',
          age: 28,
          weightKg: 80,
          heightCm: 180,
          waistCm: 82,
          neckCm: 39,
          hipCm: 95,
          experienceLevel: 'intermediario',
          trainingMethod: 'heavy_duty',
          focusGroup: 'Costas',
          initialStatus: {
            isFullRecoveryAchieved: true,
            hasPreviousInjuries: false,
            injuryNotes: '',
            isOvertrainingSuspected: false,
          },
        },
        updateProfile: updateProfileMock,
      })
    );

    render(
      <ThemeProvider theme={darkTheme}>
        <AthleteProfileScreen />
      </ThemeProvider>
    );

    // Verifica cabeçalho e identificação
    expect(screen.getByText('Perfil do Atleta')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Atleta Teste')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Fenômeno')).toBeInTheDocument();

    // Verifica presença das métricas calculadas (Gordura corporal, massa magra, IMC)
    expect(screen.getByText(/% Gordura \(BF\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Massa Magra/i)).toBeInTheDocument();
    expect(screen.getByText(/Massa Gorda/i)).toBeInTheDocument();
    expect(screen.getByText(/Cintura\/Estatura/i)).toBeInTheDocument();
    expect(screen.getByText(/Por que não usamos apenas o IMC\?/i)).toBeInTheDocument();
  });

  it('permite editar peso, apelido e salvar as novas informações do atleta', async () => {
    const updateProfileMock = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(AppContextModule, 'useApp').mockReturnValue(
      createMockAppContext({
        profile: {
          name: 'Carlos Silva',
          nickname: 'Carlão',
          gender: 'masculino',
          age: 30,
          weightKg: 85,
          heightCm: 178,
          waistCm: 86,
          neckCm: 40,
          hipCm: 98,
          experienceLevel: 'avancado',
          trainingMethod: 'heavy_duty',
          focusGroup: 'Peitoral',
          initialStatus: {
            isFullRecoveryAchieved: true,
            hasPreviousInjuries: false,
            injuryNotes: '',
            isOvertrainingSuspected: false,
          },
        },
        updateProfile: updateProfileMock,
      })
    );

    render(
      <ThemeProvider theme={darkTheme}>
        <AthleteProfileScreen />
      </ThemeProvider>
    );

    const nicknameInput = screen.getByDisplayValue('Carlão');
    fireEvent.change(nicknameInput, { target: { value: 'Monstro' } });

    const saveButton = screen.getByRole('button', { name: /Salvar Dados do Perfil/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateProfileMock).toHaveBeenCalledTimes(1);
      expect(updateProfileMock).toHaveBeenCalledWith(
        expect.objectContaining({
          nickname: 'Monstro',
        })
      );
    });
  });
});
