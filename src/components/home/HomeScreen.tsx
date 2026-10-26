import React from 'react';
import styled from 'styled-components';
import { Play, ShieldAlert, Calendar, Dumbbell, ArrowRight, Activity, Clock, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { getWorkoutById } from '../../services/workoutService';
import { INITIAL_WORKOUTS } from '../../data/initialWorkouts';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 30px;
`;

const GreetingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const GreetingTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const GreetingSubtitle = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ReturnAlertCard = styled(Card)`
  background: ${({ theme }) => (theme.name === 'dark' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.12)')};
  border-color: ${({ theme }) => theme.colors.warning};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AlertHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.colors.warning};
  font-weight: 700;
  font-size: 0.95rem;
`;

const AlertText = styled.p`
  font-size: 0.85rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

const AlertGuidelineList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 6px;
  list-style: none;
`;

const GuidelineItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    color: ${({ theme }) => theme.colors.warning};
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const NextWorkoutCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

const WorkoutHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const WorkoutMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const WorkoutTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const WorkoutFocus = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ExercisePreviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.md};
`;

const PreviewItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const StatCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px;
`;

const StatIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2px;
`;

const StatValue = styled.span`
  font-size: 1.25rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  font-weight: 600;
`;

const PrioritiesCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionHeader = styled.h4`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PriorityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    color: ${({ theme }) => theme.colors.success};
    flex-shrink: 0;
  }
`;

export const HomeScreen: React.FC = () => {
  const { profile, setCurrentTab, startWorkout } = useApp();

  const handleStartWorkout = async () => {
    const workoutA = (await getWorkoutById('treino_a')) || INITIAL_WORKOUTS[0];
    await startWorkout(workoutA);
  };

  return (
    <Container>
      <GreetingSection>
        <GreetingTitle>Olá, {profile.name}!</GreetingTitle>
        <GreetingSubtitle>
          {profile.methodDescription} • Frequência: {profile.weeklyFrequency}x na semana
        </GreetingSubtitle>
      </GreetingSection>

      {/* Alerta de Retorno Seguro (Duas semanas sem treinar) */}
      <ReturnAlertCard>
        <AlertHeader>
          <ShieldAlert size={20} />
          Protocolo de Retorno Seguro Ativo
        </AlertHeader>
        <AlertText>
          Você está no período de adaptação ({profile.initialStatus.daysInactive} dias sem treinar).
          Protegendo a região lombar e construindo base sustentável.
        </AlertText>
        <AlertGuidelineList>
          <GuidelineItem>
            <Activity size={16} />
            Semana 1: 2 séries de trabalho por exercício com RIR 3 a 4.
          </GuidelineItem>
          <GuidelineItem>
            <Activity size={16} />
            Não realizar testes de carga máxima nem ir até a falha deliberada.
          </GuidelineItem>
          <GuidelineItem>
            <Activity size={16} />
            Histórico lombar: priorizar exercícios com máquinas e apoios estáveis.
          </GuidelineItem>
        </AlertGuidelineList>
      </ReturnAlertCard>

      {/* Próximo Treino em Destaque */}
      <NextWorkoutCard highlight>
        <WorkoutHeader>
          <WorkoutMeta>
            <Badge variant="primary">Próxima Sessão Recomendada</Badge>
            <WorkoutTitle>Treino A — Pernas, Peito e Costas</WorkoutTitle>
            <WorkoutFocus>Ênfase em máquinas com apoio e estabilidade articular</WorkoutFocus>
          </WorkoutMeta>
        </WorkoutHeader>

        <ExercisePreviewList>
          <PreviewItem>
            <span>Leg press 45°</span>
            <strong>2 séries • 8-12 reps</strong>
          </PreviewItem>
          <PreviewItem>
            <span>Supino em máquina</span>
            <strong>2 séries • 8-12 reps</strong>
          </PreviewItem>
          <PreviewItem>
            <span>Remada sentada com apoio</span>
            <strong>2 séries • 8-12 reps</strong>
          </PreviewItem>
          <PreviewItem>
            <span>Mesa flexora</span>
            <strong>2 séries • 10-15 reps</strong>
          </PreviewItem>
          <PreviewItem>
            <span>Elevação lateral</span>
            <strong>2 séries • 12-15 reps</strong>
          </PreviewItem>
          <PreviewItem>
            <span>Abdominal na máquina</span>
            <strong>2 séries • 10-15 reps</strong>
          </PreviewItem>
        </ExercisePreviewList>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleStartWorkout}
          aria-label="Iniciar Treino A"
        >
          <Play size={20} fill="currentColor" />
          Iniciar Treino A
        </Button>
      </NextWorkoutCard>

      {/* Indicadores Rápidos da Semana */}
      <StatsGrid>
        <StatCard>
          <StatIcon>
            <Calendar size={20} />
          </StatIcon>
          <StatValue>0 / {profile.weeklyFrequency}</StatValue>
          <StatLabel>Sessões nesta semana</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>
            <Clock size={20} />
          </StatIcon>
          <StatValue>{profile.availableDurationMinutes.min}-{profile.availableDurationMinutes.max}m</StatValue>
          <StatLabel>Duração média por treino</StatLabel>
        </StatCard>
      </StatsGrid>

      {/* Card de Prioridades do Usuário */}
      <PrioritiesCard>
        <SectionHeader>
          <Dumbbell size={18} />
          Diretrizes & Prioridades Atuais
        </SectionHeader>
        {profile.priorities.map((priority, index) => (
          <PriorityItem key={index}>
            <CheckCircle2 size={16} />
            <span>{priority}</span>
          </PriorityItem>
        ))}
      </PrioritiesCard>

      {/* Acesso rápido às configurações */}
      <Button
        variant="secondary"
        size="md"
        fullWidth
        onClick={() => setCurrentTab('configuracoes')}
      >
        Editar Perfil & Objetivos
        <ArrowRight size={18} />
      </Button>
    </Container>
  );
};
