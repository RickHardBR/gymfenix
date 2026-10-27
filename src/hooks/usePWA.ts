import { useState, useEffect, useCallback } from 'react';

// Tipagem para o evento beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detecta se já está rodando em modo standalone (app instalado)
    let isStandaloneMode = false;
    try {
      if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
        isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      }
      if (!isStandaloneMode && typeof window !== 'undefined' && (window.navigator as unknown as { standalone?: boolean })?.standalone === true) {
        isStandaloneMode = true;
      }
    } catch {
      isStandaloneMode = false;
    }

    setIsStandalone(isStandaloneMode);

    // Detecta iOS (Safari)
    let isIosDevice = false;
    try {
      if (typeof window !== 'undefined' && window.navigator && window.navigator.userAgent) {
        const userAgent = window.navigator.userAgent.toLowerCase();
        isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      }
    } catch {
      isIosDevice = false;
    }
    setIsIOS(isIosDevice);

    // Listener para o evento beforeinstallprompt (Android / Chrome / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listener para quando o app for instalado
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setIsStandalone(true);
    };

    // Listener para mudança de fullscreen
    const handleFullscreenChange = () => {
      const isFull = Boolean(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement
      );
      setIsFullscreen(isFull);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Solicitar instalação
  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      }
    } catch (err) {
      console.warn('Erro ao disparar prompt de instalação PWA:', err);
    }
    return false;
  }, [deferredPrompt]);

  // Alternar tela cheia nativa
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement && !(document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement) {
        const elem = document.documentElement as HTMLElement & {
          webkitRequestFullscreen?: () => Promise<void>;
        };

        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        }
      } else {
        const doc = document as Document & {
          webkitExitFullscreen?: () => Promise<void>;
        };

        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Erro ao alternar modo tela cheia:', err);
    }
  }, []);

  return {
    isInstallable,
    isStandalone,
    isFullscreen,
    isIOS,
    promptInstall,
    toggleFullscreen,
  };
}
