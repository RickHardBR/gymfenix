import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Play, Edit3, Copy, Plus, Dumbbell, Clock } from 'lucide-react';
import type { WorkoutTemplate } from '../../types/workout';
import { getAllWorkouts, duplicateWorkout, saveWorkout } from '../../services/workoutService';
import { getAllExercises } from '../../services/exerciseService';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { WorkoutEditScreen } from './WorkoutEditScreen';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-bottom: 40px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const TitleCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const WorkoutList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const WorkoutCard = styled(Card)<{ $isA?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-left: 4px solid ${({ theme, $isA }) => ($isA ? theme.colors.primary : theme.colors.border)};
  transition: transform 0.15s ease;
`;

const WorkoutTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

const WorkoutName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const WorkoutSubtitle = styled.span`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const WorkoutMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ExerciseListMini = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 20px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.surfaceHover};
  padding: 10px 14px 10px 28px;
  border-radius: ${({ theme }) => theme.radii.md};
`;

const ActionButtonsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
`;

export const WorkoutListScreen: React.FC = () => {
  const { showFeedback, startWorkout } = useApp();
  const [workouts, setWorkouts] = useState<WorkoutTemplate[]>([]);
  const [exerciseNamesMap, setExerciseNamesMap] = useState<Record<string, string>>({});
  const [editingWorkout, setEditingWorkout] = useState<WorkoutTemplate | null>(null);

  const fetchWorkoutsAndExercises = async () => {
    const [workoutsData, exercisesData] = await Promise.all([
      getAllWorkouts(),
      getAllExercises(),
    ]);
    setWorkouts(workoutsData);

    const map: Record<string, string> = {};
    exercisesData.forEach((ex) => {
      map[ex.id] = ex.name;
    });
    setExerciseNamesMap(map);
  };

  useEffect(() => {
    fetchWorkoutsAndExercises();
  }, []);

  const handleStartWorkout = async (workout: WorkoutTemplate) => {
    await startWorkout(workout);
  };

  const handleDuplicate = async (workoutId: string) => {
    try {
      const copy = await duplicateWorkout(workoutId);
      setWorkouts((prev) => [...prev, copy]);
      showFeedback(`Treino "${copy.name}" criado como cópia!`);
    } catch {
      showFeedback('Erro ao duplicar treino.');
    }
  };

  const handleCreateNewWorkout = async () => {
    const newId = `treino_custom_${Date.now()}`;
    const newWorkout: WorkoutTemplate = {
      id: newId,
      name: `Treino ${String.fromCharCode(65 + workouts.length)}`,
      subtitle: 'Treino Personalizado',
      description: 'Modelo de treino personalizado criado pelo usuário.',
      estimatedDurationMinutes: 60,
      isCustom: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      exercises: [],
    };

    await saveWorkout(newWorkout);
    setWorkouts((prev) => [...prev, newWorkout]);
    setEditingWorkout(newWorkout);
    showFeedback('Novo modelo de treino criado!');
  };

  if (editingWorkout) {
    return (
      <WorkoutEditScreen
        workout={editingWorkout}
        onBack={() => setEditingWorkout(null)}
        onSaved={(updated) => {
          setWorkouts((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
          setEditingWorkout(null);
        }}
      />
    );
  }

  return (
    <Container>
      <HeaderRow>
        <TitleCol>
          <Title>Rotina de Treinos</Title>
          <Subtitle>Método Full Body alternado A, B e C</Subtitle>
        </TitleCol>

        <Button variant="primary" size="sm" onClick={handleCreateNewWorkout} aria-label="Criar novo modelo de treino">
          <Plus size={16} />
          Novo Treino
        </Button>
      </HeaderRow>

      <WorkoutList>
        {workouts.map((w) => {
          const isTreinoA = w.id === 'treino_a';
          return (
            <WorkoutCard key={w.id} $isA={isTreinoA}>
              <WorkoutTop>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <WorkoutName>{w.name}</WorkoutName>
                    {isTreinoA && <Badge variant="primary">Próximo</Badge>}
                    {w.isCustom && <Badge variant="warning">Personalizado</Badge>}
                  </div>
                  <WorkoutSubtitle>{w.subtitle}</WorkoutSubtitle>
                </div>
              </WorkoutTop>

              <WorkoutMetaRow>
                <MetaItem>
                  <Dumbbell size={15} />
                  <span>{w.exercises.length} exercícios</span>
                </MetaItem>
                <MetaItem>
                  <Clock size={15} />
                  <span>~{w.estimatedDurationMinutes} minutos</span>
                </MetaItem>
              </WorkoutMetaRow>

              {/* Lista dos primeiros exercícios */}
              <ExerciseListMini>
                {w.exercises.map((item, idx) => (
                  <li key={idx}>
                    <strong>{exerciseNamesMap[item.exerciseId] || item.exerciseId.replace(/_/g, ' ')}</strong>
                    {' — '}
                    <span>{item.plannedSets} séries ({item.minReps}-{item.maxReps} reps)</span>
                  </li>
                ))}
              </ExerciseListMini>

              <ActionButtonsRow>
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => handleStartWorkout(w)}
                  aria-label={`Iniciar ${w.name}`}
                >
                  <Play size={18} fill="currentColor" />
                  Iniciar {w.name}
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setEditingWorkout(w)}
                  aria-label={`Editar ${w.name}`}
                  title="Editar exercícios e parâmetros"
                >
                  <Edit3 size={18} />
                </Button>

                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => handleDuplicate(w.id)}
                  aria-label={`Duplicar ${w.name}`}
                  title="Duplicar treino"
                >
                  <Copy size={18} />
                </Button>
              </ActionButtonsRow>
            </WorkoutCard>
          );
        })}
      </WorkoutList>
    </Container>
  );
};
