import React, { useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { AppProvider, useApp } from './context/AppContext';
import { darkTheme, lightTheme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomeScreen } from './components/home/HomeScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { WorkoutListScreen } from './components/workouts/WorkoutListScreen';
import { ExerciseListScreen } from './components/exercises/ExerciseListScreen';
import { ProgressScreen } from './components/progress/ProgressScreen';
import { PlaceholderScreen } from './components/placeholder/PlaceholderScreen';
import { ActiveWorkoutScreen } from './components/active-workout/ActiveWorkoutScreen';
import { LoginScreen } from './components/auth/LoginScreen';
import { Flame, Play } from 'lucide-react';

const MainLayout = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ContentContainer = styled.main`
  flex: 1;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 16px 16px 84px 16px;
`;

const ActiveSessionBanner = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  padding: 10px 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.85rem;
  font-weight: 700;
  box-shadow: ${({ theme }) => theme.shadows.glow};
  cursor: pointer;
  margin-bottom: 12px;
  animation: pulse 2s infinite ease-in-out;

  @keyframes pulse {
    0% { opacity: 0.95; }
    50% { opacity: 1; }
    100% { opacity: 0.95; }
  }
`;

const ToastNotification = styled.div`
  position: fixed;
  bottom: 76px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 10px 18px;
  border-radius: ${({ theme }) => theme.radii.full};
  box-shadow: ${({ theme }) => theme.shadows.glow};
  font-size: 0.875rem;
  font-weight: 600;
  z-index: 150;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fadeIn 0.25s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, 10px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.125rem;
  font-weight: 700;
`;

const AppContent: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    settings,
    isLoading,
    feedbackMessage,
    activeSession,
    finishActiveWorkout,
    cancelActiveWorkout,
    isAuthModalOpen,
    closeAuthModal,
    user,
  } = useApp();

  const [viewingActiveSession, setViewingActiveSession] = useState<boolean>(true);
  const [hasSkippedLogin, setHasSkippedLogin] = useState<boolean>(() => {
    return sessionStorage.getItem('fenix_guest_mode') === 'true';
  });

  React.useEffect(() => {
    if (activeSession) {
      setViewingActiveSession(true);
    }
  }, [activeSession]);

  const activeTheme = settings.theme === 'light' ? lightTheme : darkTheme;

  if (isLoading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <GlobalStyles />
        <LoadingContainer>Carregando Fenix Gym Tracker...</LoadingContainer>
      </ThemeProvider>
    );
  }

  // Se não houver usuário autenticado no Supabase e não escolheu modo convidado/offline:
  if (!user && !hasSkippedLogin) {
    return (
      <ThemeProvider theme={activeTheme}>
        <GlobalStyles />
        <LoginScreen
          onSuccess={() => {
            sessionStorage.removeItem('fenix_guest_mode');
            setHasSkippedLogin(false);
            closeAuthModal();
          }}
          onContinueOffline={() => {
            sessionStorage.setItem('fenix_guest_mode', 'true');
            setHasSkippedLogin(true);
            closeAuthModal();
          }}
        />
        {feedbackMessage && <ToastNotification>{feedbackMessage}</ToastNotification>}
      </ThemeProvider>
    );
  }

  // Se houver treino ativo e o usuário estiver focado nele:
  const shouldShowActiveScreen = activeSession && viewingActiveSession;

  const renderActiveScreen = () => {
    if (shouldShowActiveScreen) {
      return (
        <ActiveWorkoutScreen
          session={activeSession}
          onFinishWorkout={() => {
            finishActiveWorkout();
            setViewingActiveSession(false);
          }}
          onCancelWorkout={async () => {
            await cancelActiveWorkout();
            setViewingActiveSession(false);
          }}
        />
      );
    }

    switch (currentTab) {
      case 'inicio':
        return <HomeScreen />;
      case 'treinos':
        return <WorkoutListScreen />;
      case 'exercicios':
        return <ExerciseListScreen />;
      case 'configuracoes':
        return <ProfileScreen />;
      case 'evolucao':
        return <ProgressScreen />;
      default:
        return <PlaceholderScreen tab={currentTab} />;
    }
  };

  return (
    <ThemeProvider theme={activeTheme}>
      <GlobalStyles />
      <MainLayout>
        <Header />
        <ContentContainer>
          {activeSession && !viewingActiveSession && (
            <ActiveSessionBanner
              onClick={() => {
                setViewingActiveSession(true);
                setCurrentTab('treinos');
              }}
              aria-label="Retomar treino em andamento"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Flame size={18} />
                <span>Treino em Andamento: {activeSession.templateName}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Play size={16} fill="currentColor" />
                <span>Retomar</span>
              </div>
            </ActiveSessionBanner>
          )}

          {renderActiveScreen()}
        </ContentContainer>
        {feedbackMessage && <ToastNotification>{feedbackMessage}</ToastNotification>}
        {isAuthModalOpen && (
          <LoginScreen
            onSuccess={closeAuthModal}
            onContinueOffline={closeAuthModal}
          />
        )}
        <BottomNav />
      </MainLayout>
    </ThemeProvider>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
