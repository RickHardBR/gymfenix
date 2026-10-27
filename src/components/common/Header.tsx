import React, { useState } from 'react';
import styled from 'styled-components';
import { Flame, Sun, Moon, Cloud, CloudCheck, RefreshCw, LogOut, Maximize, Minimize, Smartphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePWA } from '../../hooks/usePWA';
import { PWAInstallModal } from './PWAInstallModal';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 50;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
`;

const BrandText = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 1.125rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.text};

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Subtitle = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloudButton = styled.button<{ $connected?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ $connected, theme }) => ($connected ? `${theme.colors.success}18` : theme.colors.surfaceHover)};
  border: 1px solid ${({ $connected, theme }) => ($connected ? theme.colors.success : theme.colors.border)};
  color: ${({ $connected, theme }) => ($connected ? theme.colors.success : theme.colors.textSecondary)};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $connected, theme }) => ($connected ? `${theme.colors.success}28` : theme.colors.surfaceActive)};
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surfaceActive};
  }
`;

export const Header: React.FC = () => {
  const { settings, toggleTheme, user, openAuthModal, syncWithCloud, isSyncing, logout } = useApp();
  const { isInstallable, isStandalone, isFullscreen, isIOS, promptInstall, toggleFullscreen } = usePWA();
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  return (
    <>
      <HeaderContainer>
        <Brand>
          <LogoIconWrapper data-testid="brand-logo">
            <Flame size={22} />
          </LogoIconWrapper>
          <BrandText>
            <Title>
              FENIX <span>GYM</span>
            </Title>
            <Subtitle>Tracker</Subtitle>
          </BrandText>
        </Brand>

        <Actions>
          {user ? (
            <>
              <CloudButton
                $connected
                onClick={() => syncWithCloud()}
                disabled={isSyncing}
                title="Clique para sincronizar com o Supabase"
                aria-label="Sincronizar com o Supabase"
              >
                {isSyncing ? <RefreshCw size={14} className="spin" /> : <CloudCheck size={14} />}
                <span>{isSyncing ? 'Sincronizando...' : 'Nuvem'}</span>
              </CloudButton>
              <IconButton
                onClick={logout}
                title={`Conectado como ${user.email}. Clique para desconectar.`}
                aria-label="Desconectar do Supabase"
              >
                <LogOut size={16} />
              </IconButton>
            </>
          ) : (
            <CloudButton onClick={openAuthModal} aria-label="Entrar ou criar conta na nuvem">
              <Cloud size={14} />
              <span>Nuvem</span>
            </CloudButton>
          )}

          {/* Botão de Instalar no Celular (se não estiver em modo app instalado) */}
          {!isStandalone && (
            <IconButton
              onClick={() => setIsInstallModalOpen(true)}
              aria-label="Instalar no Celular em Tela Cheia"
              title="Instalar no Celular em Tela Cheia"
            >
              <Smartphone size={17} />
            </IconButton>
          )}

          {/* Botão de Alternar Modo Tela Cheia Imediato */}
          <IconButton
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Sair da tela cheia' : 'Entrar em modo tela cheia'}
            title={isFullscreen ? 'Sair da tela cheia' : 'Modo tela cheia'}
          >
            {isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
          </IconButton>

          {/* Botão de Alternar Tema */}
          <IconButton
            onClick={toggleTheme}
            aria-label={settings?.theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            title={settings?.theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
          >
            {settings?.theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </IconButton>
        </Actions>
      </HeaderContainer>

      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onInstall={promptInstall}
        isIOS={isIOS}
        isInstallable={isInstallable}
        onToggleFullscreen={toggleFullscreen}
      />
    </>
  );
};
