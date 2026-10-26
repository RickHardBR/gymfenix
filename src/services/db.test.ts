import { describe, it, expect, beforeEach } from 'vitest';
import { getStoredProfile, saveStoredProfile, getStoredSettings, saveStoredSettings } from './db';
import { INITIAL_USER_PROFILE, INITIAL_USER_SETTINGS } from '../types/profile';
import type { UserProfile } from '../types/profile';

describe('Local Database Service (IndexedDB + Storage)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('recupera o perfil padrão inicial quando o banco estiver vazio', async () => {
    const profile = await getStoredProfile();
    expect(profile.name).toBe(INITIAL_USER_PROFILE.name);
    expect(profile.weeklyFrequency).toBe(3);
    expect(profile.method).toBe('fullbody_abc');
    expect(profile.initialStatus.daysInactive).toBe(14);
  });

  it('salva e recupera alterações no perfil do usuário', async () => {
    const updatedProfile: UserProfile = {
      ...INITIAL_USER_PROFILE,
      name: 'Carlos Fênix',
      weeklyFrequency: 4,
    };

    await saveStoredProfile(updatedProfile);
    const retrieved = await getStoredProfile();

    expect(retrieved.name).toBe('Carlos Fênix');
    expect(retrieved.weeklyFrequency).toBe(4);
  });

  it('salva e recupera configurações da aplicação', async () => {
    await saveStoredSettings({
      ...INITIAL_USER_SETTINGS,
      theme: 'light',
      restTimerDefaultSeconds: 120,
    });

    const retrieved = await getStoredSettings();
    expect(retrieved.theme).toBe('light');
    expect(retrieved.restTimerDefaultSeconds).toBe(120);
  });
});
