import React from 'react';
import styled from 'styled-components';
import { Download, Smartphone, Maximize, X, Share, PlusSquare, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 250;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 16px;

  @media (min-width: 600px) {
    align-items: center;
  }
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  width: 100%;
  max-width: 480px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.25s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.full};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const BenefitsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: ${({ theme }) => theme.colors.background};
  padding: 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.88rem;
  color: ${({ theme }) => theme.colors.text};

  svg {
    color: #ff5500;
    flex-shrink: 0;
  }
`;

const StepsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;

const Step = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.88rem;
  color: ${({ theme }) => theme.colors.text};

  strong {
    color: #ff5500;
  }
`;

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => Promise<boolean | void>;
  isIOS: boolean;
  isInstallable: boolean;
  onToggleFullscreen: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  isIOS,
  isInstallable,
  onToggleFullscreen,
}) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <HeaderRow>
          <Title>
            <Smartphone size={24} color="#ff5500" /> Instalar no Celular
          </Title>
          <CloseButton onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </CloseButton>
        </HeaderRow>

        <BenefitsList>
          <BenefitItem>
            <Maximize size={18} />
            <span><strong>Tela Cheia Total:</strong> Remove as barras do navegador.</span>
          </BenefitItem>
          <BenefitItem>
            <CheckCircle2 size={18} />
            <span><strong>Acesso Rápido:</strong> Ícone exclusivo na tela inicial do celular.</span>
          </BenefitItem>
          <BenefitItem>
            <Download size={18} />
            <span><strong>100% Offline:</strong> Registre seus treinos na academia sem internet.</span>
          </BenefitItem>
        </BenefitsList>

        {isIOS ? (
          <StepsBox>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ff5500', marginBottom: 4 }}>
              Como instalar no iPhone / iPad (Safari):
            </div>
            <Step>
              <Share size={20} color="#38bdf8" />
              <div>1. Toque no botão <strong>Compartilhar</strong> na barra inferior do Safari.</div>
            </Step>
            <Step>
              <PlusSquare size={20} color="#ff5500" />
              <div>2. Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.</div>
            </Step>
            <Step>
              <CheckCircle2 size={20} color="#10b981" />
              <div>3. Toque em <strong>Adicionar</strong> no topo direito. O app abrirá em tela cheia!</div>
            </Step>
          </StepsBox>
        ) : isInstallable ? (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={async () => {
              await onInstall();
              onClose();
            }}
          >
            <Download size={18} /> Instalar Aplicativo Agora
          </Button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: 0 }}>
              Para instalar, use a opção <strong>"Adicionar à tela inicial"</strong> ou <strong>"Instalar aplicativo"</strong> no menu do seu navegador (três pontinhos).
            </p>
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => {
                onToggleFullscreen();
                onClose();
              }}
            >
              <Maximize size={16} /> Ativar Modo Tela Cheia Imediato
            </Button>
          </div>
        )}

        <Button variant="ghost" size="sm" onClick={onClose}>
          Fechar
        </Button>
      </ModalContent>
    </Overlay>
  );
};
