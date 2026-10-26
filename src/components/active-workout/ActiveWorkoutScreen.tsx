import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Check,
  Plus,
  Trash2,
  Clock,
  ShieldAlert,
  History,
  AlertTriangle,
  X,
  Award,
  Activity,
} from 'lucide-react';
import type { WorkoutSession, ExerciseSetLog, SetType, PainReport } from '../../types/session';
import type { Exercise } from '../../types/workout';
import {
  saveActiveSession,
  finishSession,
  getLastExercisePerformance,
  calculateSessionVolume,
  calculateWorkingSetsCount,
} from '../../services/sessionService';
import { getExerciseById } from '../../services/exerciseService';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { RestTimer } from '../timer/RestTimer';
import { ExerciseGuideDrawer } from '../exercises/ExerciseGuideDrawer';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-bottom: 90px;
`;

const StickySessionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: sticky;
  top: 68px;
  z-index: 40;
`;

const SessionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SessionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const ElapsedTime = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ExerciseCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

const ExerciseHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const ExerciseTitle = styled.h4`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const HistoryBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  padding: 6px 10px;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SetsTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const SetRowHeader = styled.div`
  display: grid;
  grid-template-columns: 36px 70px 1fr 1fr 1fr 44px;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  text-align: center;
  padding: 0 4px;
`;

const SetRow = styled.div<{ $isCompleted: boolean; $isWarmup: boolean }>`
  display: grid;
  grid-template-columns: 36px 70px 1fr 1fr 1fr 44px;
  gap: 6px;
  align-items: center;
  background: ${({ theme, $isCompleted, $isWarmup }) =>
    $isCompleted
      ? theme.name === 'dark'
        ? 'rgba(16, 185, 129, 0.12)'
        : 'rgba(16, 185, 129, 0.1)'
      : $isWarmup
      ? theme.name === 'dark'
        ? 'rgba(245, 158, 11, 0.08)'
        : 'rgba(245, 158, 11, 0.08)'
      : theme.colors.surfaceHover};
  border: 1px solid
    ${({ theme, $isCompleted }) => ($isCompleted ? theme.colors.success : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 6px 4px;
  transition: all 0.15s ease;
`;

const SetIndex = styled.span`
  font-weight: 700;
  font-size: 0.85rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`;

const MiniSelect = styled.select`
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 6px 2px;
  font-size: 0.75rem;
  text-align: center;
  outline: none;
`;

const MiniInput = styled.input`
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 8px 4px;
  font-size: 0.9rem;
  font-weight: 700;
  text-align: center;
  outline: none;
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors.borderFocus};
  }
`;

const CheckButton = styled.button<{ $isCompleted: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin: 0 auto;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme, $isCompleted }) =>
    $isCompleted ? theme.colors.success : theme.colors.surfaceActive};
  color: ${({ $isCompleted }) => ($isCompleted ? '#ffffff' : '#9ca3af')};
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.92);
  }
`;

const ExerciseFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 4px;
  flex-wrap: wrap;
`;

const PainAlertBadge = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(239, 68, 68, 0.12);
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.danger};
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.75rem;
  font-weight: 700;
`;

// Modal de Relato de Dor
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  z-index: 220;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  width: 100%;
  max-width: 480px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

// Modal de Resumo do Treino Concluído
const SummaryModal = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.xl};
  width: 100%;
  max-width: 500px;
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.glow};
`;

interface ActiveWorkoutScreenProps {
  session: WorkoutSession;
  onFinishWorkout: () => void;
  onCancelWorkout: () => void;
}

export const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({
  session: initialSession,
  onFinishWorkout,
  onCancelWorkout,
}) => {
  const { settings, showFeedback } = useApp();
  const [session, setSession] = useState<WorkoutSession>(initialSession);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [restTimerSeconds, setRestTimerSeconds] = useState<number | null>(null);
  const [lastPerformanceMap, setLastPerformanceMap] = useState<Record<string, string>>({});

  // Estado do modal de dor
  const [painExerciseIndex, setPainExerciseIndex] = useState<number | null>(null);
  const [painRegion, setPainRegion] = useState('');
  const [painIntensity, setPainIntensity] = useState(5);
  const [painStopped, setPainStopped] = useState(false);
  const [painNotes, setPainNotes] = useState('');

  // Estado do modal de resumo final
  const [completedSummary, setCompletedSummary] = useState<WorkoutSession | null>(null);

  // Estado do Guia Visual do Exercício
  const [activeGuideExercise, setActiveGuideExercise] = useState<Exercise | null>(null);

  const handleOpenGuide = async (exerciseId: string, fallbackName: string) => {
    const fullEx = await getExerciseById(exerciseId);
    if (fullEx) {
      setActiveGuideExercise(fullEx);
    } else {
      // Fallback básico caso o exercício não esteja no banco
      setActiveGuideExercise({
        id: exerciseId,
        name: fallbackName,
        primaryMuscle: 'corpo_inteiro',
        secondaryMuscles: [],
        equipment: 'outro',
        type: 'composto',
        difficulty: 'iniciante',
        instructions: [
          'Mantenha a postura alinhada durante todo o movimento.',
          'Execute a fase excêntrica de forma controlada (3 segundos).',
          'Expire no pico de contração sem usar impulsos da lombar.',
        ],
        commonMistakes: [
          'Curvar a coluna ou compensar com a lombar.',
          'Executar o movimento rápido demais sem tensão mecânica.',
        ],
        equipmentSetup: 'Ajuste a carga e a posição para garantir amplitude segura.',
        alternatives: [],
        safetyWarnings: 'Se sentir dores agudas articulares, interrompa imediatamente.',
        createdAt: new Date().toISOString(),
      });
    }
  };

  // Contador de duração em tempo real
  useEffect(() => {
    const startMs = new Date(session.startedAt).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      setElapsedSec(Math.max(0, Math.floor((now - startMs) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, [session.startedAt]);

  // Carrega histórico dos exercícios
  useEffect(() => {
    let isMounted = true;
    const loadLastPerformances = async () => {
      const map: Record<string, string> = {};
      for (const ex of session.exercises) {
        const perf = await getLastExercisePerformance(ex.exerciseId);
        if (perf && perf.length > 0) {
          const setsSummary = perf.map((s) => `${s.weightKg}kg×${s.reps}`).join(', ');
          map[ex.exerciseId] = setsSummary;
        }
      }
      if (isMounted) setLastPerformanceMap(map);
    };
    loadLastPerformances();
    return () => {
      isMounted = false;
    };
  }, [session.exercises]);

  const handleUpdateSet = async (
    exerciseIndex: number,
    setIndex: number,
    field: keyof ExerciseSetLog,
    value: unknown
  ) => {
    const updatedExercises = [...session.exercises];
    const targetSet = {
      ...updatedExercises[exerciseIndex].sets[setIndex],
      [field]: value,
    };
    updatedExercises[exerciseIndex].sets[setIndex] = targetSet;

    const newSession: WorkoutSession = {
      ...session,
      exercises: updatedExercises,
    };
    setSession(newSession);
    await saveActiveSession(newSession);
  };

  const handleToggleCompleteSet = async (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...session.exercises];
    const targetSet = updatedExercises[exerciseIndex].sets[setIndex];
    const willBeCompleted = !targetSet.isCompleted;

    targetSet.isCompleted = willBeCompleted;
    targetSet.completedAt = willBeCompleted ? new Date().toISOString() : undefined;

    const newSession: WorkoutSession = {
      ...session,
      exercises: updatedExercises,
    };
    setSession(newSession);
    await saveActiveSession(newSession);

    // Se completou a série e o início automático de descanso está ativo, dispara o cronômetro
    if (willBeCompleted && settings.autoStartTimer) {
      const exerciseRest = updatedExercises[exerciseIndex].restSeconds || settings.restTimerDefaultSeconds;
      setRestTimerSeconds(exerciseRest);
    }
  };

  const handleAddSet = async (exerciseIndex: number) => {
    const updatedExercises = [...session.exercises];
    const currentSets = updatedExercises[exerciseIndex].sets;
    const lastSet = currentSets[currentSets.length - 1];

    const newSet: ExerciseSetLog = {
      id: `set_${Date.now()}`,
      setNumber: currentSets.length + 1,
      type: 'trabalho',
      weightKg: lastSet ? lastSet.weightKg : 0,
      reps: lastSet ? lastSet.reps : 10,
      rir: lastSet ? lastSet.rir : 3,
      isCompleted: false,
    };

    updatedExercises[exerciseIndex].sets = [...currentSets, newSet];
    const newSession = { ...session, exercises: updatedExercises };
    setSession(newSession);
    await saveActiveSession(newSession);
  };

  const handleRemoveSet = async (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...session.exercises];
    const filtered = updatedExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    const reordered = filtered.map((s, i) => ({ ...s, setNumber: i + 1 }));
    updatedExercises[exerciseIndex].sets = reordered;

    const newSession = { ...session, exercises: updatedExercises };
    setSession(newSession);
    await saveActiveSession(newSession);
  };

  const handleSavePainReport = async () => {
    if (painExerciseIndex === null) return;
    const report: PainReport = {
      region: painRegion.trim() || 'Região lombar / Articular',
      intensity: painIntensity,
      stopped: painStopped,
      notes: painNotes.trim(),
    };

    const updatedExercises = [...session.exercises];
    updatedExercises[painExerciseIndex].painReport = report;
    const newSession = { ...session, exercises: updatedExercises };

    setSession(newSession);
    await saveActiveSession(newSession);

    showFeedback('Relato de dor registrado. Priorize sua segurança e interrompa se necessário.');
    setPainExerciseIndex(null);
  };

  const handleFinish = async () => {
    const finishedAt = new Date().toISOString();
    const startedTime = new Date(session.startedAt).getTime();
    const duration = Math.max(1, Math.round((Date.now() - startedTime) / 1000));
    const summary: WorkoutSession = {
      ...session,
      status: 'concluido',
      finishedAt,
      durationSeconds: duration,
      totalVolumeKg: calculateSessionVolume(session.exercises),
      totalWorkingSets: calculateWorkingSetsCount(session.exercises),
    };
    setCompletedSummary(summary);
    await finishSession(session);
  };

  const handleConfirmSummaryClose = () => {
    setCompletedSummary(null);
    onFinishWorkout();
  };

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <Container>
      {/* Barra Superior Fixa do Treino em Andamento */}
      <StickySessionBar>
        <SessionInfo>
          <SessionTitle>{session.templateName}</SessionTitle>
          <ElapsedTime>
            <Clock size={14} />
            {formatDuration(elapsedSec)}
          </ElapsedTime>
        </SessionInfo>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" size="sm" onClick={onCancelWorkout}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={handleFinish} aria-label="Finalizar Treino">
            <Check size={16} /> Finalizar
          </Button>
        </div>
      </StickySessionBar>

      {/* Lista de Exercícios da Sessão */}
      {session.exercises.map((ex, exIdx) => {
        const lastPerf = lastPerformanceMap[ex.exerciseId];
        return (
          <ExerciseCard key={ex.exerciseId}>
            <ExerciseHeader>
              <div>
                <ExerciseTitle>{ex.exerciseName}</ExerciseTitle>
                <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                  <Badge variant="neutral">Descanso: {ex.restSeconds}s</Badge>
                  <Badge variant="accent">RIR Alvo: {ex.targetRir}</Badge>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenGuide(ex.exerciseId, ex.exerciseName)}
                  title="Ver Guia de Execução & Cadência"
                  aria-label={`Ver Guia de ${ex.exerciseName}`}
                  style={{ padding: '4px 8px', fontSize: '0.75rem', gap: 4 }}
                >
                  <Activity size={14} color="#ff5500" /> Guia
                </Button>

                {lastPerf && (
                  <HistoryBanner title="Desempenho anterior">
                    <History size={14} />
                    <span>Última: {lastPerf}</span>
                  </HistoryBanner>
                )}
              </div>
            </ExerciseHeader>

            {/* Aviso se houver relato de dor neste exercício */}
            {ex.painReport && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #ef4444',
                  fontSize: '0.8rem',
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <AlertTriangle size={16} />
                <span>
                  <strong>Atenção:</strong> Desconforto registrado ({ex.painReport.region}, Nível {ex.painReport.intensity}/10).
                  {ex.painReport.stopped && ' Exercício interrompido para proteção da coluna.'}
                </span>
              </div>
            )}

            {/* Tabela de Séries */}
            <SetsTable>
              <SetRowHeader>
                <span>Série</span>
                <span>Tipo</span>
                <span>Kg</span>
                <span>Reps</span>
                <span>RIR</span>
                <span>Feito</span>
              </SetRowHeader>

              {ex.sets.map((set, setIdx) => (
                <SetRow
                  key={set.id}
                  $isCompleted={set.isCompleted}
                  $isWarmup={set.type === 'aquecimento'}
                >
                  <SetIndex>{set.setNumber}</SetIndex>

                  <MiniSelect
                    aria-label={`Tipo da série ${set.setNumber}`}
                    value={set.type}
                    onChange={(e) =>
                      handleUpdateSet(exIdx, setIdx, 'type', e.target.value as SetType)
                    }
                  >
                    <option value="trabalho">Trabalho</option>
                    <option value="aquecimento">Aquec.</option>
                    <option value="falha">Falha</option>
                  </MiniSelect>

                  <MiniInput
                    type="number"
                    min="0"
                    step="0.5"
                    aria-label={`Carga em kg da série ${set.setNumber}`}
                    value={set.weightKg === 0 ? '' : set.weightKg}
                    placeholder="0"
                    onChange={(e) =>
                      handleUpdateSet(exIdx, setIdx, 'weightKg', Number(e.target.value))
                    }
                  />

                  <MiniInput
                    type="number"
                    min="0"
                    aria-label={`Repetições da série ${set.setNumber}`}
                    value={set.reps === 0 ? '' : set.reps}
                    placeholder="0"
                    onChange={(e) =>
                      handleUpdateSet(exIdx, setIdx, 'reps', Number(e.target.value))
                    }
                  />

                  <MiniSelect
                    aria-label={`RIR da série ${set.setNumber}`}
                    value={set.rir}
                    onChange={(e) =>
                      handleUpdateSet(exIdx, setIdx, 'rir', Number(e.target.value))
                    }
                  >
                    <option value="4">RIR 4</option>
                    <option value="3">RIR 3</option>
                    <option value="2">RIR 2</option>
                    <option value="1">RIR 1</option>
                    <option value="0">RIR 0</option>
                  </MiniSelect>

                  <CheckButton
                    $isCompleted={set.isCompleted}
                    onClick={() => handleToggleCompleteSet(exIdx, setIdx)}
                    aria-label={set.isCompleted ? `Desmarcar série ${set.setNumber}` : `Concluir série ${set.setNumber}`}
                  >
                    <Check size={18} strokeWidth={set.isCompleted ? 3 : 2} />
                  </CheckButton>
                </SetRow>
              ))}
            </SetsTable>

            <ExerciseFooter>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddSet(exIdx)}
                aria-label="Adicionar série"
              >
                <Plus size={16} /> Série
              </Button>

              {ex.sets.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSet(exIdx, ex.sets.length - 1)}
                  aria-label="Remover última série"
                  style={{ color: '#ef4444' }}
                >
                  <Trash2 size={15} /> Remover
                </Button>
              )}

              <PainAlertBadge
                onClick={() => {
                  setPainExerciseIndex(exIdx);
                  setPainRegion('Região Lombar');
                  setPainIntensity(4);
                  setPainStopped(false);
                  setPainNotes('');
                }}
                aria-label="Relatar dor ou desconforto neste exercício"
              >
                <ShieldAlert size={14} /> Relatar Dor / Desconforto
              </PainAlertBadge>
            </ExerciseFooter>
          </ExerciseCard>
        );
      })}

      {/* Cronômetro de Descanso Flutuante */}
      {restTimerSeconds !== null && (
        <RestTimer
          initialSeconds={restTimerSeconds}
          soundEnabled={settings.soundEnabled}
          onClose={() => setRestTimerSeconds(null)}
          onFinish={() => {
            showFeedback('Descanso terminado! Pronto para a próxima série.');
          }}
        />
      )}

      {/* Modal de Relato de Dor e Segurança Lombar */}
      {painExerciseIndex !== null && (
        <ModalOverlay onClick={() => setPainExerciseIndex(null)} role="dialog" aria-modal="true">
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444' }}>
                <ShieldAlert size={22} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Segurança e Adaptação</h3>
              </div>
              <button onClick={() => setPainExerciseIndex(null)} style={{ color: '#9ca3af' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.4 }}>
              Se sentir dor articular ou na coluna lombar, <strong>interrompa o exercício imediatamente</strong>. Não tente treinar através da dor.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Região Afetada:
                <input
                  type="text"
                  value={painRegion}
                  onChange={(e) => setPainRegion(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: 4, borderRadius: 6, background: '#0d1117', color: '#fff', border: '1px solid #30363d' }}
                />
              </label>

              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Intensidade Percebida (1 a 10): <strong>{painIntensity}</strong>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={painIntensity}
                  onChange={(e) => setPainIntensity(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#ef4444', marginTop: 4 }}
                />
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={painStopped}
                  onChange={(e) => setPainStopped(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#ef4444' }}
                />
                <span>Interrompi o exercício por segurança</span>
              </label>

              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Observações Adicionais:
                <textarea
                  value={painNotes}
                  onChange={(e) => setPainNotes(e.target.value)}
                  placeholder="Ex: leve pontada na lombar ao empurrar no fundo do leg press..."
                  style={{ width: '100%', padding: '8px', marginTop: 4, borderRadius: 6, background: '#0d1117', color: '#fff', border: '1px solid #30363d', minHeight: 60 }}
                />
              </label>

              <Button variant="danger" size="md" fullWidth onClick={handleSavePainReport}>
                Salvar Relato de Segurança
              </Button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal de Resumo de Conclusão do Treino */}
      {completedSummary && (
        <ModalOverlay role="dialog" aria-modal="true" aria-label="Resumo do Treino Concluído">
          <SummaryModal>
            <div style={{ margin: '0 auto', width: 64, height: 64, borderRadius: '50%', background: 'rgba(249, 115, 22, 0.15)', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={36} />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Treino Concluído com Sucesso!</h2>
            <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
              Excelente dedicação! Seus dados de carga e repetições foram gravados no histórico.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, background: '#1f242c', padding: 14, borderRadius: 12 }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Duração</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 800 }}>{formatDuration(completedSummary.durationSeconds)}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Volume Trabalho</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f97316' }}>{completedSummary.totalVolumeKg} kg</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase' }}>Séries Feitas</span>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>{completedSummary.totalWorkingSets}</p>
              </div>
            </div>

            <Button variant="primary" size="lg" fullWidth onClick={handleConfirmSummaryClose}>
              Concluir e Voltar
            </Button>
          </SummaryModal>
        </ModalOverlay>
      )}

      {/* Guia Visual e Anatômico com Cadência em Tempo Real */}
      {activeGuideExercise && (
        <ExerciseGuideDrawer
          exercise={activeGuideExercise}
          isOpen={!!activeGuideExercise}
          onClose={() => setActiveGuideExercise(null)}
        />
      )}
    </Container>
  );
};
