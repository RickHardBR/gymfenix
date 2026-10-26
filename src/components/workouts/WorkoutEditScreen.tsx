import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import type { WorkoutTemplate, WorkoutExerciseConfig, Exercise } from '../../types/workout';
import { getAllExercises } from '../../services/exerciseService';
import { saveWorkout } from '../../services/workoutService';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

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

const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 10px 12px;
  font-size: 0.9rem;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.borderFocus};
  }
`;

const ExerciseCardItem = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
`;

const ExerciseItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ExerciseNameText = styled.span`
  font-weight: 700;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const OrderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.textSecondary};

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceActive};
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const ParamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ParamBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ParamLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
`;

const SelectMini = styled.select`
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  padding: 6px;
  font-size: 0.85rem;
`;

const AddExerciseSelect = styled.select`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 10px 14px;
  font-size: 0.9rem;
  width: 100%;
`;

interface WorkoutEditScreenProps {
  workout: WorkoutTemplate;
  onBack: () => void;
  onSaved: (updated: WorkoutTemplate) => void;
}

export const WorkoutEditScreen: React.FC<WorkoutEditScreenProps> = ({ workout, onBack, onSaved }) => {
  const { showFeedback } = useApp();
  const [formData, setFormData] = useState<WorkoutTemplate>(workout);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [selectedToAdd, setSelectedToAdd] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const fetch = async () => {
      const data = await getAllExercises();
      if (isMounted) setAllExercises(data);
    };
    fetch();
    return () => {
      isMounted = false;
    };
  }, []);

  const getExerciseName = (exId: string) => {
    const found = allExercises.find((e) => e.id === exId);
    return found ? found.name : exId.replace(/_/g, ' ');
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const list = [...formData.exercises];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Atualiza campo order
    const updated = list.map((item, i) => ({ ...item, order: i + 1 }));
    setFormData((prev) => ({ ...prev, exercises: updated }));
  };

  const handleRemove = (index: number) => {
    const list = formData.exercises.filter((_, i) => i !== index);
    const updated = list.map((item, i) => ({ ...item, order: i + 1 }));
    setFormData((prev) => ({ ...prev, exercises: updated }));
  };

  const handleUpdateExerciseParam = (
    index: number,
    field: keyof WorkoutExerciseConfig,
    value: unknown
  ) => {
    const list = [...formData.exercises];
    list[index] = {
      ...list[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, exercises: list }));
  };

  const handleAddExercise = () => {
    if (!selectedToAdd) return;
    const newConfig: WorkoutExerciseConfig = {
      exerciseId: selectedToAdd,
      order: formData.exercises.length + 1,
      plannedSets: 2,
      minReps: 8,
      maxReps: 12,
      restSeconds: 90,
      targetRir: 3,
      notes: '',
    };
    setFormData((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newConfig],
    }));
    setSelectedToAdd('');
  };

  const handleSave = async () => {
    await saveWorkout(formData);
    showFeedback(`Treino "${formData.name}" salvo com sucesso!`);
    onSaved(formData);
  };

  return (
    <Container>
      <HeaderRow>
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={18} />
          Voltar
        </Button>
        <Button variant="primary" size="sm" onClick={handleSave}>
          <Save size={18} />
          Salvar Treino
        </Button>
      </HeaderRow>

      <Title>Editar {formData.name}</Title>

      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FormGroup>
            <Label htmlFor="workout-edit-name">Nome do Treino</Label>
            <Input
              id="workout-edit-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="workout-edit-subtitle">Subtítulo / Ênfase</Label>
            <Input
              id="workout-edit-subtitle"
              type="text"
              value={formData.subtitle}
              onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
            />
          </FormGroup>
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
          Exercícios do Treino ({formData.exercises.length})
        </h3>
      </div>

      {formData.exercises.map((item, index) => (
        <ExerciseCardItem key={`${item.exerciseId}_${index}`}>
          <ExerciseItemHeader>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Badge variant="primary">{index + 1}º</Badge>
              <ExerciseNameText>{getExerciseName(item.exerciseId)}</ExerciseNameText>
            </div>

            <OrderControls>
              <IconButton
                disabled={index === 0}
                onClick={() => handleMove(index, 'up')}
                aria-label="Mover para cima"
              >
                <ArrowUp size={16} />
              </IconButton>
              <IconButton
                disabled={index === formData.exercises.length - 1}
                onClick={() => handleMove(index, 'down')}
                aria-label="Mover para baixo"
              >
                <ArrowDown size={16} />
              </IconButton>
              <IconButton
                onClick={() => handleRemove(index)}
                aria-label="Remover exercício do treino"
                style={{ color: '#ef4444' }}
              >
                <Trash2 size={16} />
              </IconButton>
            </OrderControls>
          </ExerciseItemHeader>

          <ParamsGrid>
            <ParamBox>
              <ParamLabel>Séries</ParamLabel>
              <SelectMini
                aria-label={`Séries de ${getExerciseName(item.exerciseId)}`}
                value={item.plannedSets}
                onChange={(e) => handleUpdateExerciseParam(index, 'plannedSets', Number(e.target.value))}
              >
                <option value="1">1 série</option>
                <option value="2">2 séries (Retorno)</option>
                <option value="3">3 séries</option>
                <option value="4">4 séries</option>
              </SelectMini>
            </ParamBox>

            <ParamBox>
              <ParamLabel>Faixa Reps</ParamLabel>
              <SelectMini
                aria-label={`Faixa de repetições de ${getExerciseName(item.exerciseId)}`}
                value={`${item.minReps}-${item.maxReps}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-').map(Number);
                  handleUpdateExerciseParam(index, 'minReps', min);
                  handleUpdateExerciseParam(index, 'maxReps', max);
                }}
              >
                <option value="6-8">6 a 8 reps</option>
                <option value="8-12">8 a 12 reps</option>
                <option value="10-15">10 a 15 reps</option>
                <option value="12-15">12 a 15 reps</option>
                <option value="15-20">15 a 20 reps</option>
              </SelectMini>
            </ParamBox>

            <ParamBox>
              <ParamLabel>Descanso</ParamLabel>
              <SelectMini
                aria-label={`Descanso de ${getExerciseName(item.exerciseId)}`}
                value={item.restSeconds}
                onChange={(e) => handleUpdateExerciseParam(index, 'restSeconds', Number(e.target.value))}
              >
                <option value="60">60s</option>
                <option value="75">75s</option>
                <option value="90">90s</option>
                <option value="120">2 min</option>
                <option value="150">2m 30s</option>
                <option value="180">3 min</option>
              </SelectMini>
            </ParamBox>

            <ParamBox>
              <ParamLabel>RIR Alvo</ParamLabel>
              <SelectMini
                aria-label={`RIR de ${getExerciseName(item.exerciseId)}`}
                value={item.targetRir}
                onChange={(e) => handleUpdateExerciseParam(index, 'targetRir', Number(e.target.value))}
              >
                <option value="4">RIR 4 (Seguro)</option>
                <option value="3">RIR 3 (Adaptativo)</option>
                <option value="2">RIR 2 (Padrão)</option>
                <option value="1">RIR 1 (Intenso)</option>
              </SelectMini>
            </ParamBox>
          </ParamsGrid>
        </ExerciseCardItem>
      ))}

      {/* Adicionar exercício ao treino */}
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Label htmlFor="select-exercise-to-add">Adicionar Exercício da Biblioteca</Label>
          <div style={{ display: 'flex', gap: 8 }}>
            <AddExerciseSelect
              id="select-exercise-to-add"
              aria-label="Selecionar exercício para adicionar ao treino"
              value={selectedToAdd}
              onChange={(e) => setSelectedToAdd(e.target.value)}
            >
              <option value="">Selecione um exercício...</option>
              {allExercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.primaryMuscle})
                </option>
              ))}
            </AddExerciseSelect>
            <Button
              variant="secondary"
              size="sm"
              disabled={!selectedToAdd}
              onClick={handleAddExercise}
            >
              <Plus size={16} /> Adicionar
            </Button>
          </div>
        </div>
      </Card>
    </Container>
  );
};
