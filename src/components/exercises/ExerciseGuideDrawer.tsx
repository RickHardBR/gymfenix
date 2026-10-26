import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  X,
  Play,
  Pause,
  CheckCircle,
  AlertTriangle,
  Sliders,
  Wind,
  Layers,
  Activity,
  ShieldCheck,
  Image as ImageIcon,
} from 'lucide-react';
import type { Exercise } from '../../types/workout';
import { Badge } from '../common/Badge';
import { getExerciseMedia } from '../../data/exerciseMedia';

interface ExerciseGuideDrawerProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 2100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: fadeIn 0.2s ease-out;

  @media (min-width: 640px) {
    align-items: center;
    padding: 20px;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const DrawerCard = styled.div`
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-top-left-radius: ${({ theme }) => theme.radii.lg};
  border-top-right-radius: ${({ theme }) => theme.radii.lg};
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  animation: slideUp 0.25s ease-out;

  @media (min-width: 640px) {
    border-radius: ${({ theme }) => theme.radii.lg};
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.colors.surface};
  z-index: 10;
`;

const HeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ExerciseTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.full};
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ContentBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ViewToggleBar = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 3px;
  gap: 4px;
`;

const ViewToggleButton = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: none;
  font-size: 0.825rem;
  font-weight: 700;
  cursor: pointer;
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  color: ${({ $active, theme }) => ($active ? '#ffffff' : theme.colors.textSecondary)};
  transition: all 0.2s;
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 85, 0, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(255, 85, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 85, 0, 0); }
`;

// Palco Visual com Foto/GIF Real do Exercício
const VisualMediaStage = styled.div`
  background: #0d1117;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const MediaContainer = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  background: #11141a;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 480px) {
    height: 280px;
  }
`;

const RealExerciseImage = styled.img<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  background-color: #0d1117;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transform: ${({ $active }) => ($active ? 'scale(1)' : 'scale(0.98)')};
  transition: opacity 0.35s ease-in-out, transform 0.35s ease-in-out;
`;

const MediaBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(6px);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.725rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
  z-index: 2;
`;

const CadenceOverlay = styled.div`
  padding: 14px 16px;
  background: #161b22;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CadenceBarWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ProgressBarTrack = styled.div`
  width: 100%;
  height: 8px;
  background: #21262d;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const ProgressBarFill = styled.div<{ $progress: number; $isEccentric: boolean }>`
  height: 100%;
  width: ${({ $progress }) => `${$progress}%`};
  background: ${({ $isEccentric }) => ($isEccentric ? '#38bdf8' : '#f97316')};
  transition: width 0.1s linear, background-color 0.2s;
  border-radius: 4px;
`;

const CadenceLegend = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.775rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const BreathingCueBadge = styled.div<{ $isEccentric: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.8rem;
  font-weight: 700;
  align-self: flex-start;
  background: ${({ $isEccentric }) =>
    $isEccentric ? 'rgba(56, 189, 248, 0.15)' : 'rgba(249, 115, 22, 0.15)'};
  color: ${({ $isEccentric }) => ($isEccentric ? '#38bdf8' : '#f97316')};
  border: 1px solid
    ${({ $isEccentric }) => ($isEccentric ? 'rgba(56, 189, 248, 0.35)' : 'rgba(249, 115, 22, 0.35)')};
  animation: ${pulseGlow} 2s infinite;
`;

// Visualização de Fases A e B com Fotos Reais
const PhasesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;

  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const PhaseCard = styled.div<{ $activeBorder?: string }>`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ $activeBorder, theme }) => $activeBorder || theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const PhaseImageContainer = styled.div`
  width: 100%;
  height: 150px;
  position: relative;
  background: #0d1117;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
`;

const PhaseImageTag = styled.div<{ $bgColor: string }>`
  position: absolute;
  top: 8px;
  left: 8px;
  background: ${({ $bgColor }) => $bgColor};
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const PhaseDetails = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PhaseTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const PhaseDesc = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: 1.45;
`;

// Semáforo de Segurança Lombar & Postura
const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SectionTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CueItem = styled.div<{ $type: 'correct' | 'danger' | 'setup' }>`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.825rem;
  line-height: 1.4;

  ${({ $type, theme }) => {
    switch ($type) {
      case 'correct':
        return `
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.25);
          color: ${theme.colors.text};
          svg { color: #10b981; flex-shrink: 0; margin-top: 2px; }
        `;
      case 'danger':
        return `
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.25);
          color: ${theme.colors.text};
          svg { color: #ef4444; flex-shrink: 0; margin-top: 2px; }
        `;
      case 'setup':
        return `
          background: rgba(249, 115, 22, 0.1);
          border: 1px solid rgba(249, 115, 22, 0.25);
          color: ${theme.colors.text};
          svg { color: #f97316; flex-shrink: 0; margin-top: 2px; }
        `;
    }
  }}
`;

export const ExerciseGuideDrawer: React.FC<ExerciseGuideDrawerProps> = ({
  exercise,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'loop' | 'phases'>('loop');
  const [isCadencePlaying, setIsCadencePlaying] = useState<boolean>(true);
  const [cycleTime, setCycleTime] = useState<number>(0);

  const media = getExerciseMedia(exercise.id);
  const phaseAImg = exercise.imagePhaseA || media.imagePhaseA;
  const phaseBImg = exercise.imagePhaseB || media.imagePhaseB;

  // Ciclo de cadência padrão: 3s descida (excêntrica) + 1s subida (concêntrica)
  const TOTAL_CYCLE_MS = 4000;
  const ECCENTRIC_MS = 3000;

  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      if (isCadencePlaying && isOpen) {
        setCycleTime((prev) => (prev + delta) % TOTAL_CYCLE_MS);
      }
      animFrame = requestAnimationFrame(tick);
    };

    if (isOpen) {
      animFrame = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(animFrame);
  }, [isCadencePlaying, isOpen]);

  if (!isOpen) return null;

  const isEccentric = cycleTime < ECCENTRIC_MS;
  const progressPercent = isEccentric
    ? (cycleTime / ECCENTRIC_MS) * 100
    : ((cycleTime - ECCENTRIC_MS) / (TOTAL_CYCLE_MS - ECCENTRIC_MS)) * 100;

  return (
    <Backdrop onClick={onClose} role="dialog" aria-modal="true" aria-label={`Guia de execução de ${exercise.name}`}>
      <DrawerCard onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderTitleGroup>
            <ExerciseTitle>
              <Activity size={20} color="#f97316" />
              {exercise.name}
            </ExerciseTitle>
            <div style={{ display: 'flex', gap: 6 }}>
              <Badge variant="primary">{exercise.primaryMuscle}</Badge>
              <Badge variant="neutral">{exercise.equipment}</Badge>
            </div>
          </HeaderTitleGroup>
          <CloseButton onClick={onClose} aria-label="Fechar guia">
            <X size={20} />
          </CloseButton>
        </Header>

        <ContentBody>
          {/* Alternador de Visualização */}
          <ViewToggleBar>
            <ViewToggleButton
              $active={activeTab === 'loop'}
              onClick={() => setActiveTab('loop')}
              type="button"
            >
              <Activity size={15} /> Cadência & Movimento
            </ViewToggleButton>
            <ViewToggleButton
              $active={activeTab === 'phases'}
              onClick={() => setActiveTab('phases')}
              type="button"
            >
              <Layers size={15} /> Posição A vs. B (Fotos)
            </ViewToggleButton>
          </ViewToggleBar>

          {/* PALCO VISUAL: LOOP DE CADÊNCIA COM FOTO/GIF REAL OU FASES ESTÁTICAS */}
          {activeTab === 'loop' ? (
            <VisualMediaStage>
              <MediaContainer>
                {/* Pose Fase A (Início / Alongamento) */}
                <RealExerciseImage
                  src={phaseAImg}
                  alt={`Fase Inicial de ${exercise.name}`}
                  $active={isEccentric}
                  loading="eager"
                />
                {/* Pose Fase B (Pico de Contração) */}
                <RealExerciseImage
                  src={phaseBImg}
                  alt={`Pico de Contração de ${exercise.name}`}
                  $active={!isEccentric}
                  loading="eager"
                />
                <MediaBadge>
                  <ImageIcon size={12} />
                  {isEccentric ? 'Fase A: Posição Inicial' : 'Fase B: Pico de Contração'}
                </MediaBadge>
              </MediaContainer>

              <CadenceOverlay>
                <BreathingCueBadge $isEccentric={isEccentric}>
                  <Wind size={15} />
                  {isEccentric
                    ? 'Descida Lenta (3s) — Inspire e controle'
                    : 'Subida Potente (1s) — Expire e contraia'}
                </BreathingCueBadge>

                <CadenceBarWrapper>
                  <ProgressBarTrack>
                    <ProgressBarFill $progress={progressPercent} $isEccentric={isEccentric} />
                  </ProgressBarTrack>
                  <CadenceLegend>
                    <span>
                      Fase: <strong>{isEccentric ? 'Excêntrica (Descida)' : 'Concêntrica (Pico)'}</strong>
                    </span>
                    <button
                      onClick={() => setIsCadencePlaying(!isCadencePlaying)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#9ca3af',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: '0.75rem',
                      }}
                    >
                      {isCadencePlaying ? <Pause size={12} /> : <Play size={12} />}
                      {isCadencePlaying ? 'Pausar' : 'Iniciar'}
                    </button>
                  </CadenceLegend>
                </CadenceBarWrapper>
              </CadenceOverlay>
            </VisualMediaStage>
          ) : (
            <PhasesGrid>
              <PhaseCard $activeBorder="rgba(56, 189, 248, 0.4)">
                <PhaseImageContainer>
                  <img src={phaseAImg} alt={`Fase A - Inicial - ${exercise.name}`} loading="lazy" />
                  <PhaseImageTag $bgColor="#0284c7">Fase A: Inicial</PhaseImageTag>
                </PhaseImageContainer>
                <PhaseDetails>
                  <PhaseTitle>Alongamento Controlado</PhaseTitle>
                  <PhaseDesc>
                    Posição inicial com apoio firme. Coluna alinhada, escápulas posicionadas e amplitude total sem perder a tensão mecânica.
                  </PhaseDesc>
                </PhaseDetails>
              </PhaseCard>

              <PhaseCard $activeBorder="rgba(249, 115, 22, 0.5)">
                <PhaseImageContainer>
                  <img src={phaseBImg} alt={`Fase B - Contração - ${exercise.name}`} loading="lazy" />
                  <PhaseImageTag $bgColor="#ea580c">Fase B: Pico</PhaseImageTag>
                </PhaseImageContainer>
                <PhaseDetails>
                  <PhaseTitle>Pico de Contração</PhaseTitle>
                  <PhaseDesc>
                    Aperto máximo no músculo-alvo sem hiperextensão articular e sem utilizar impulso ou arqueamento da região lombar.
                  </PhaseDesc>
                </PhaseDetails>
              </PhaseCard>
            </PhasesGrid>
          )}

          {/* SEMÁFORO DE SEGURANÇA LOMBAR & POSTURA */}
          <SectionBlock>
            <SectionTitle>
              <ShieldCheck size={18} color="#10b981" />
              Checklist de Execução & Postura
            </SectionTitle>
            <CueList>
              {exercise.instructions.slice(0, 3).map((inst, idx) => (
                <CueItem key={idx} $type="correct">
                  <CheckCircle size={16} />
                  <span>{inst}</span>
                </CueItem>
              ))}
            </CueList>
          </SectionBlock>

          <SectionBlock>
            <SectionTitle>
              <AlertTriangle size={18} color="#ef4444" />
              Atenção Lombar & O que Evitar
            </SectionTitle>
            <CueList>
              {exercise.safetyWarnings && (
                <CueItem $type="danger">
                  <AlertTriangle size={16} />
                  <span>
                    <strong>Cuidado Especial:</strong> {exercise.safetyWarnings}
                  </span>
                </CueItem>
              )}
              {exercise.commonMistakes.slice(0, 2).map((mistake, idx) => (
                <CueItem key={idx} $type="danger">
                  <AlertTriangle size={16} />
                  <span>{mistake}</span>
                </CueItem>
              ))}
            </CueList>
          </SectionBlock>

          {exercise.equipmentSetup && (
            <SectionBlock>
              <SectionTitle>
                <Sliders size={18} color="#f97316" />
                Setup & Regulagem do Equipamento
              </SectionTitle>
              <CueList>
                <CueItem $type="setup">
                  <Sliders size={16} />
                  <span>{exercise.equipmentSetup}</span>
                </CueItem>
              </CueList>
            </SectionBlock>
          )}
        </ContentBody>
      </DrawerCard>
    </Backdrop>
  );
};
