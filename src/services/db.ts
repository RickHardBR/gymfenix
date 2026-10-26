import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import { INITIAL_USER_PROFILE, INITIAL_USER_SETTINGS } from '../types/profile';
import type { UserProfile, UserSettings } from '../types/profile';
import type { Exercise, WorkoutTemplate } from '../types/workout';

const DB_NAME = 'fenix_gym_db';
const DB_VERSION = 1;

export interface FenixDBSchema extends DBSchema {
  profile: {
    key: string;
    value: UserProfile;
  };
  settings: {
    key: string;
    value: UserSettings;
  };
  exercises: {
    key: string;
    value: Exercise;
    indexes: { 'by-muscle': string };
  };
  workoutTemplates: {
    key: string;
    value: WorkoutTemplate;
  };
  sessions: {
    key: string;
    value: Record<string, unknown>;
    indexes: { 'by-date': string };
  };
  bodyMeasurements: {
    key: string;
    value: Record<string, unknown>;
    indexes: { 'by-date': string };
  };
  painLogs: {
    key: string;
    value: Record<string, unknown>;
    indexes: { 'by-session': string; 'by-date': string };
  };
}

let dbPromise: Promise<IDBPDatabase<FenixDBSchema>> | null = null;

export const getDB = async (): Promise<IDBPDatabase<FenixDBSchema>> => {
  if (!dbPromise) {
    dbPromise = openDB<FenixDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, _newVersion) {
        if (oldVersion < 1) {
          // Store do perfil
          if (!db.objectStoreNames.contains('profile')) {
            db.createObjectStore('profile');
          }

          // Store de configurações
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings');
          }

          // Store de exercícios
          if (!db.objectStoreNames.contains('exercises')) {
            const exerciseStore = db.createObjectStore('exercises', { keyPath: 'id' });
            exerciseStore.createIndex('by-muscle', 'primaryMuscle');
          }

          // Store de modelos de treinos (A, B, C)
          if (!db.objectStoreNames.contains('workoutTemplates')) {
            db.createObjectStore('workoutTemplates', { keyPath: 'id' });
          }

          // Store de sessões executadas
          if (!db.objectStoreNames.contains('sessions')) {
            const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
            sessionStore.createIndex('by-date', 'startedAt');
          }

          // Store de medidas corporais
          if (!db.objectStoreNames.contains('bodyMeasurements')) {
            const bodyStore = db.createObjectStore('bodyMeasurements', { keyPath: 'id' });
            bodyStore.createIndex('by-date', 'measuredAt');
          }

          // Store de relatos de dor e desconforto
          if (!db.objectStoreNames.contains('painLogs')) {
            const painStore = db.createObjectStore('painLogs', { keyPath: 'id' });
            painStore.createIndex('by-session', 'sessionId');
            painStore.createIndex('by-date', 'loggedAt');
          }
        }
      },
    });
  }
  return dbPromise;
};

// Funções de Perfil com Fallback para LocalStorage
const PROFILE_KEY = 'fenix_profile_current';
const SETTINGS_KEY = 'fenix_settings_current';

export const getStoredProfile = async (): Promise<UserProfile> => {
  try {
    const db = await getDB();
    const profile = await db.get('profile', 'current');
    if (profile) return profile;
  } catch (error) {
    console.warn('Erro ao acessar IndexedDB para perfil, tentando fallback:', error);
  }

  // Fallback LocalStorage
  const local = localStorage.getItem(PROFILE_KEY);
  if (local) {
    try {
      return JSON.parse(local) as UserProfile;
    } catch {
      // JSON inválido, retorna padrão
    }
  }

  // Inicializa padrão
  await saveStoredProfile(INITIAL_USER_PROFILE);
  return INITIAL_USER_PROFILE;
};

export const saveStoredProfile = async (profile: UserProfile): Promise<void> => {
  const updated = {
    ...profile,
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await getDB();
    await db.put('profile', updated, 'current');
  } catch (error) {
    console.warn('Erro ao salvar perfil no IndexedDB:', error);
  }

  // Salva no fallback LocalStorage também para redundância de segurança
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Erro ao salvar no LocalStorage:', e);
  }
};

export const getStoredSettings = async (): Promise<UserSettings> => {
  try {
    const db = await getDB();
    const settings = await db.get('settings', 'current');
    if (settings) return settings;
  } catch (error) {
    console.warn('Erro ao acessar IndexedDB para configurações:', error);
  }

  const local = localStorage.getItem(SETTINGS_KEY);
  if (local) {
    try {
      return JSON.parse(local) as UserSettings;
    } catch {
      // JSON inválido
    }
  }

  await saveStoredSettings(INITIAL_USER_SETTINGS);
  return INITIAL_USER_SETTINGS;
};

export const saveStoredSettings = async (settings: UserSettings): Promise<void> => {
  try {
    const db = await getDB();
    await db.put('settings', settings, 'current');
  } catch (error) {
    console.warn('Erro ao salvar configurações no IndexedDB:', error);
  }

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Erro ao salvar configurações no LocalStorage:', e);
  }
};
