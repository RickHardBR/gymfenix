import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { INITIAL_USER_PROFILE, INITIAL_USER_SETTINGS } from '../types/profile';
import type { UserProfile, UserSettings } from '../types/profile';
import type { WorkoutSession } from '../types/session';
import type { WorkoutTemplate } from '../types/workout';
import { getStoredProfile, saveStoredProfile, getStoredSettings, saveStoredSettings } from '../services/db';
import { getActiveSession, startSession, cancelActiveSession } from '../services/sessionService';
import { getAllExercises } from '../services/exerciseService';
import { getCurrentUser, subscribeToAuthChanges, signOutUser } from '../services/authService';
import { syncUserProfileToCloud, syncAllSessionsWithCloud } from '../services/syncService';

export type AppTab = 'inicio' | 'treinos' | 'exercicios' | 'evolucao' | 'perfil' | 'configuracoes';

interface AppContextData {
  currentTab: AppTab;
  setCurrentTab: (tab: AppTab) => void;
  profile: UserProfile;
  settings: UserSettings;
  isLoading: boolean;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  updateSettings: (updated: Partial<UserSettings>) => Promise<void>;
  toggleTheme: () => void;
  feedbackMessage: string | null;
  showFeedback: (msg: string) => void;
  activeSession: WorkoutSession | null;
  startWorkout: (template: WorkoutTemplate) => Promise<void>;
  finishActiveWorkout: () => void;
  cancelActiveWorkout: () => Promise<void>;
  // Autenticação & Nuvem (Supabase)
  user: User | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  syncWithCloud: () => Promise<void>;
  isSyncing: boolean;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextData>({} as AppContextData);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<AppTab>('inicio');
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [settings, setSettings] = useState<UserSettings>(INITIAL_USER_SETTINGS);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Estados de Auth & Nuvem
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const showFeedback = useCallback((msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage((current) => (current === msg ? null : current));
    }, 3500);
  }, []);

  const syncWithCloud = useCallback(async () => {
    if (!user) return;
    setIsSyncing(true);
    try {
      await syncUserProfileToCloud(profile, user.id);
      const { syncedCount, downloadedCount } = await syncAllSessionsWithCloud(user.id);
      if (syncedCount > 0 || downloadedCount > 0) {
        showFeedback(`Sincronizado com a nuvem (${syncedCount} enviados, ${downloadedCount} recebidos).`);
      } else {
        showFeedback('Dados sincronizados com o Supabase.');
      }
    } catch (err) {
      console.warn('Falha na sincronização:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [user, profile, showFeedback]);

  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      try {
        const [loadedProfile, loadedSettings, loadedActiveSession, currentUser] = await Promise.all([
          getStoredProfile(),
          getStoredSettings(),
          getActiveSession(),
          getCurrentUser(),
        ]);
        if (isMounted) {
          setProfile(loadedProfile);
          setSettings(loadedSettings);
          setUser(currentUser);
          if (loadedActiveSession) {
            setActiveSession(loadedActiveSession);
          }
        }
      } catch (err) {
        console.error('Erro ao inicializar contexto do app:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialData();

    // Listener de estado de autenticação do Supabase
    const authSub = subscribeToAuthChanges((newUser) => {
      if (isMounted) {
        setUser(newUser);
        if (newUser) {
          showFeedback(`Conectado como ${newUser.email}`);
        }
      }
    });

    return () => {
      isMounted = false;
      authSub.unsubscribe();
    };
  }, [showFeedback]);

  const updateProfile = async (updated: Partial<UserProfile>) => {
    const newProfile: UserProfile = {
      ...profile,
      ...updated,
      updatedAt: new Date().toISOString(),
    };
    setProfile(newProfile);
    await saveStoredProfile(newProfile);
    if (user) {
      syncUserProfileToCloud(newProfile, user.id).catch(() => {});
    }
    showFeedback('Perfil atualizado com sucesso!');
  };

  const updateSettings = async (updated: Partial<UserSettings>) => {
    const newSettings: UserSettings = {
      ...settings,
      ...updated,
    };
    setSettings(newSettings);
    await saveStoredSettings(newSettings);
    showFeedback('Configurações salvas!');
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
  };

  const startWorkout = async (template: WorkoutTemplate) => {
    const allExercises = await getAllExercises();
    const newSession = startSession(template, allExercises);
    setActiveSession(newSession);
    showFeedback(`Treino "${template.name}" iniciado! Bom treino!`);
  };

  const finishActiveWorkout = () => {
    setActiveSession(null);
    setCurrentTab('inicio');
    showFeedback('Treino concluído e salvo no histórico!');
    if (user) {
      // Sincroniza em background
      syncWithCloud().catch(() => {});
    }
  };

  const cancelActiveWorkout = async () => {
    if (window.confirm('Tem certeza de que deseja cancelar e descartar a sessão atual?')) {
      if (activeSession) {
        await cancelActiveSession(activeSession.id);
      }
      setActiveSession(null);
      showFeedback('Sessão cancelada.');
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const logout = async () => {
    await signOutUser();
    sessionStorage.removeItem('fenix_guest_mode');
    setUser(null);
    showFeedback('Desconectado. Seus dados continuam salvos localmente.');
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        profile,
        settings,
        isLoading,
        updateProfile,
        updateSettings,
        toggleTheme,
        feedbackMessage,
        showFeedback,
        activeSession,
        startWorkout,
        finishActiveWorkout,
        cancelActiveWorkout,
        user,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        syncWithCloud,
        isSyncing,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
