import { vi } from 'vitest';
import { INITIAL_USER_PROFILE, INITIAL_USER_SETTINGS } from '../types/profile';
import type { AppTab } from '../context/AppContext';

export const createMockAppContext = (overrides = {}) => ({
  currentTab: 'inicio' as AppTab,
  setCurrentTab: vi.fn(),
  profile: INITIAL_USER_PROFILE,
  settings: INITIAL_USER_SETTINGS,
  isLoading: false,
  updateProfile: vi.fn(),
  updateSettings: vi.fn(),
  toggleTheme: vi.fn(),
  feedbackMessage: null,
  showFeedback: vi.fn(),
  activeSession: null,
  startWorkout: vi.fn(),
  finishActiveWorkout: vi.fn(),
  cancelActiveWorkout: vi.fn(),
  user: null,
  isAuthModalOpen: false,
  openAuthModal: vi.fn(),
  closeAuthModal: vi.fn(),
  syncWithCloud: vi.fn(),
  isSyncing: false,
  logout: vi.fn(),
  ...overrides,
});
