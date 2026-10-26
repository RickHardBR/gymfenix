import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Play, Pause, SkipForward, Plus, Minus, X } from 'lucide-react';
import { playTimerCompletionSound } from '../../utils/audio';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

const FloatingTimerContainer = styled.div<{ $isFinished: boolean }>`
  position: fixed;
  bottom: 74px;
  left: 12px;
  right: 12px;
  max-width: 580px;
  margin: 0 auto;
  background: ${({ theme, $isFinished }) =>
    $isFinished ? theme.colors.success : theme.colors.surface};
  color: ${({ theme, $isFinished }) => ($isFinished ? '#ffffff' : theme.colors.text)};
  border: 1.5px solid
    ${({ theme, $isFinished }) => ($isFinished ? theme.colors.success : theme.colors.primary)};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  z-index: 120;
  animation: ${({ $isFinished }) => ($isFinished ? pulse : 'none')} 1s infinite ease-in-out;
  transition: background-color 0.3s ease;
`;

const TimeDisplay = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimerLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
`;

const TimeNumber = styled.span`
  font-size: 1.6rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ControlButton = styled.button<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme, $primary }) =>
    $primary ? theme.colors.primary : theme.colors.surfaceHover};
  color: ${({ theme, $primary }) => ($primary ? '#ffffff' : theme.colors.text)};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme, $primary }) =>
      $primary ? theme.colors.primaryHover : theme.colors.surfaceActive};
  }
`;

interface RestTimerProps {
  initialSeconds: number;
  soundEnabled: boolean;
  onFinish?: () => void;
  onClose: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  initialSeconds,
  soundEnabled,
  onFinish,
  onClose,
}) => {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const targetEndTimeRef = useRef<number>(Date.now() + initialSeconds * 1000);
  const hasPlayedSoundRef = useRef<boolean>(false);

  useEffect(() => {
    targetEndTimeRef.current = Date.now() + initialSeconds * 1000;
    setRemainingSeconds(initialSeconds);
    setIsRunning(true);
    setIsFinished(false);
    hasPlayedSoundRef.current = false;
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((targetEndTimeRef.current - now) / 1000));
      setRemainingSeconds(diff);

      if (diff <= 0) {
        setIsRunning(false);
        setIsFinished(true);
        if (!hasPlayedSoundRef.current && soundEnabled) {
          playTimerCompletionSound();
          hasPlayedSoundRef.current = true;
        }
        if (onFinish) onFinish();
        clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isRunning, soundEnabled, onFinish]);

  const handleTogglePause = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      targetEndTimeRef.current = Date.now() + remainingSeconds * 1000;
      setIsRunning(true);
    }
  };

  const handleAdjustTime = (deltaSeconds: number) => {
    const newSeconds = Math.max(0, remainingSeconds + deltaSeconds);
    targetEndTimeRef.current = Date.now() + newSeconds * 1000;
    setRemainingSeconds(newSeconds);
    if (newSeconds > 0 && isFinished) {
      setIsFinished(false);
      setIsRunning(true);
      hasPlayedSoundRef.current = false;
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <FloatingTimerContainer
      $isFinished={isFinished}
      role="region"
      aria-label="Cronômetro de descanso entre séries"
    >
      <TimeDisplay>
        <TimerLabel>{isFinished ? 'Descanso Concluído!' : 'Tempo de Descanso'}</TimerLabel>
        <TimeNumber>{formatTime(remainingSeconds)}</TimeNumber>
      </TimeDisplay>

      <ControlsRow>
        <ControlButton
          onClick={() => handleAdjustTime(-15)}
          title="Diminuir 15 segundos"
          aria-label="Diminuir 15 segundos"
        >
          <Minus size={16} />
        </ControlButton>

        <ControlButton
          onClick={() => handleAdjustTime(30)}
          title="Adicionar 30 segundos"
          aria-label="Adicionar 30 segundos"
        >
          <Plus size={16} />
        </ControlButton>

        {!isFinished && (
          <ControlButton
            $primary
            onClick={handleTogglePause}
            title={isRunning ? 'Pausar cronômetro' : 'Retomar cronômetro'}
            aria-label={isRunning ? 'Pausar' : 'Retomar'}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
          </ControlButton>
        )}

        <ControlButton
          onClick={onClose}
          title="Pular ou fechar descanso"
          aria-label="Fechar cronômetro"
        >
          {isFinished ? <X size={16} /> : <SkipForward size={16} />}
        </ControlButton>
      </ControlsRow>
    </FloatingTimerContainer>
  );
};
