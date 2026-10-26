import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  TrendingUp,
  History,
  Clock,
  Weight,
  Flame,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import type { WorkoutSession } from '../../types/session';
import type { Exercise, WorkoutTemplate } from '../../types/workout';
import { getAllSessions } from '../../services/sessionService';
import { getAllExercises } from '../../services/exerciseService';
import { getAllWorkouts } from '../../services/workoutService';
import { analyzeDoubleProgression } from '../../utils/progressionEngine';
import { DoubleProgressionCard } from './DoubleProgressionCard';
import { ExerciseProgressChart } from './ExerciseProgressChart';
import { MuscleVolumeChart } from './MuscleVolumeChart';
import { SessionDetailModal } from '../history/SessionDetailModal';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: 1.4;
`;

const TabContainer = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 4px;
  gap: 4px;
`;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? '#ffffff' : theme.colors.textSecondary};
  box-shadow: ${({ $active, theme }) =>
    $active ? theme.shadows.glow : 'none'};

  &:hover {
    color: ${({ $active, theme }) => ($active ? '#ffffff' : theme.colors.text)};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProgressionGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SessionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SessionCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const SessionTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const SessionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const SessionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 32px 16px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const ProgressScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'progressao' | 'historico'>('progressao');
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const [loadedSessions, loadedExercises, loadedTemplates] = await Promise.all([
          getAllSessions(),
          getAllExercises(),
          getAllWorkouts(),
        ]);
        if (isMounted) {
          setSessions(loadedSessions);
          setExercises(loadedExercises);
          setTemplates(loadedTemplates);
        }
      } catch (err) {
        console.error('Erro ao carregar dados de evolução:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const completedSessions = sessions.filter((s) => s.status === 'concluido');

  // Mapeia exercícios dos templates para calcular as recomendações de progressão
  const progressionCardsData = React.useMemo(() => {
    // Coleta exercícios únicos presentes nos treinos A, B e C
    const exerciseConfigMap = new Map<string, { minReps: number; maxReps: number }>();
    templates.forEach((t) => {
      t.exercises.forEach((cfg) => {
        if (!exerciseConfigMap.has(cfg.exerciseId)) {
          exerciseConfigMap.set(cfg.exerciseId, {
            minReps: cfg.minReps || 8,
            maxReps: cfg.maxReps || 12,
          });
        }
      });
    });

    const recommendations: Array<{
      exerciseId: string;
      exerciseName: string;
      recommendation: ReturnType<typeof analyzeDoubleProgression>;
    }> = [];

    exerciseConfigMap.forEach((config, exerciseId) => {
      const ex = exercises.find((e) => e.id === exerciseId);
      const name = ex ? ex.name : exerciseId.replace(/_/g, ' ');
      const rec = analyzeDoubleProgression(
        exerciseId,
        config.minReps,
        config.maxReps,
        completedSessions
      );
      recommendations.push({
        exerciseId,
        exerciseName: name,
        recommendation: rec,
      });
    });

    // Ordena: primeiro os que recomendam aumento de carga ou alerta lombar, depois progredir reps
    return recommendations.sort((a, b) => {
      const priority = {
        reduzir_deload_dor: 1,
        aumentar_carga: 2,
        progredir_reps: 3,
        manter_carga: 4,
        dados_insuficientes: 5,
      };
      return priority[a.recommendation.status] - priority[b.recommendation.status];
    });
  }, [templates, exercises, completedSessions]);

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#ff5500' }}>Carregando dados de evolução...</div>;
  }

  return (
    <Container>
      <PageHeader>
        <Title>Evolução & Histórico</Title>
        <Subtitle>
          Acompanhamento inteligente de sobrecarga progressiva dupla e segurança lombar.
        </Subtitle>
      </PageHeader>

      <TabContainer>
        <TabButton
          $active={activeTab === 'progressao'}
          onClick={() => setActiveTab('progressao')}
          aria-label="Aba de Progressão e Gráficos"
        >
          <TrendingUp size={16} />
          Progressão & Gráficos
        </TabButton>
        <TabButton
          $active={activeTab === 'historico'}
          onClick={() => setActiveTab('historico')}
          aria-label="Aba de Histórico de Sessões"
        >
          <History size={16} />
          Histórico ({completedSessions.length})
        </TabButton>
      </TabContainer>

      {activeTab === 'progressao' ? (
        <>
          <SectionHeader>
            <SectionTitle>
              <Sparkles size={18} color="#ff5500" />
              Recomendações de Carga (Progressão Dupla)
            </SectionTitle>
          </SectionHeader>

          {progressionCardsData.length === 0 ? (
            <Card>
              <EmptyState>
                <span>Nenhum exercício encontrado nos modelos de treino.</span>
              </EmptyState>
            </Card>
          ) : (
            <ProgressionGrid>
              {progressionCardsData.map((item) => (
                <DoubleProgressionCard
                  key={item.exerciseId}
                  exerciseName={item.exerciseName}
                  recommendation={item.recommendation}
                />
              ))}
            </ProgressionGrid>
          )}

          <SectionHeader>
            <SectionTitle>Gráficos de Performance</SectionTitle>
          </SectionHeader>

          <ExerciseProgressChart sessions={completedSessions} catalog={exercises} />
          <MuscleVolumeChart sessions={completedSessions} catalog={exercises} />
        </>
      ) : (
        <>
          <SectionHeader>
            <SectionTitle>Sessões Concluídas</SectionTitle>
          </SectionHeader>

          {completedSessions.length === 0 ? (
            <EmptyState>
              <History size={32} />
              <strong style={{ color: '#fff' }}>Nenhum treino realizado ainda</strong>
              <span>
                Inicie um treino pela aba <strong>Início</strong> ou <strong>Treinos</strong> para começar a registrar seu histórico.
              </span>
            </EmptyState>
          ) : (
            <SessionList>
              {completedSessions.map((session) => {
                const dateFormatted = new Date(session.startedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });
                const durationMin = Math.round(session.durationSeconds / 60);
                const hasPain = session.exercises.some((e) => e.painReport && e.painReport.intensity > 0);

                return (
                  <SessionCard
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    role="button"
                    tabIndex={0}
                  >
                    <SessionTop>
                      <div>
                        <SessionTitle>{session.templateName}</SessionTitle>
                        <div style={{ fontSize: '0.775rem', color: '#888', marginTop: 2 }}>
                          {dateFormatted}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {hasPain && (
                          <Badge variant="danger">
                            <AlertTriangle size={12} style={{ marginRight: 4 }} />
                            Desconforto
                          </Badge>
                        )}
                        <ChevronRight size={18} color="#888" />
                      </div>
                    </SessionTop>

                    <SessionMeta>
                      <MetaItem>
                        <Clock size={14} />
                        <span>{durationMin} min</span>
                      </MetaItem>
                      <MetaItem>
                        <Weight size={14} />
                        <span>{session.totalVolumeKg} kg levantados</span>
                      </MetaItem>
                      <MetaItem>
                        <Flame size={14} />
                        <span>{session.totalWorkingSets} séries de trabalho</span>
                      </MetaItem>
                    </SessionMeta>
                  </SessionCard>
                );
              })}
            </SessionList>
          )}
        </>
      )}

      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </Container>
  );
};
