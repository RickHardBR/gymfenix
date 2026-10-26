import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Save } from 'lucide-react';
import type { Exercise, MuscleGroup, EquipmentType, ExerciseType, DifficultyLevel } from '../../types/workout';
import { Button } from '../common/Button';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 210;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (min-width: 768px) {
    align-items: center;
    padding: 20px;
  }
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => `${theme.radii.xl} ${theme.radii.xl} 0 0`};
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    border-radius: ${({ theme }) => theme.radii.xl};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
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

const TextArea = styled.textarea`
  background: ${({ theme }) => theme.colors.inputBg};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 10px 12px;
  font-size: 0.9rem;
  min-height: 70px;
  outline: none;
  resize: vertical;

  &:focus {
    border-color: ${({ theme }) => theme.colors.borderFocus};
  }
`;

const Select = styled.select`
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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

interface CustomExerciseModalProps {
  onClose: () => void;
  onSave: (exercise: Exercise) => void;
}

export const CustomExerciseModal: React.FC<CustomExerciseModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [primaryMuscle, setPrimaryMuscle] = useState<MuscleGroup>('peito');
  const [equipment, setEquipment] = useState<EquipmentType>('maquina');
  const [type, setType] = useState<ExerciseType>('composto');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('iniciante');
  const [instructionsText, setInstructionsText] = useState('');
  const [safetyWarnings, setSafetyWarnings] = useState('');
  const [equipmentSetup, setEquipmentSetup] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newExercise: Exercise = {
      id: `custom_${Date.now()}`,
      name: name.trim(),
      primaryMuscle,
      secondaryMuscles: [],
      equipment,
      type,
      difficulty,
      instructions: instructionsText
        ? instructionsText.split('\n').filter((l) => l.trim().length > 0)
        : ['Executar o movimento com técnica controlada mantendo postura estável.'],
      commonMistakes: [],
      equipmentSetup: equipmentSetup.trim() || 'Ajustar o equipamento conforme a sua altura.',
      alternatives: [],
      safetyWarnings: safetyWarnings.trim() || 'Manter coluna apoiada e interromper ao sinal de dor.',
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    onSave(newExercise);
    onClose();
  };

  return (
    <Overlay onClick={onClose} role="dialog" aria-modal="true" aria-label="Cadastrar novo exercício">
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Novo Exercício Personalizado</Title>
          <button onClick={onClose} aria-label="Fechar modal" style={{ color: '#9ca3af' }}>
            <X size={20} />
          </button>
        </Header>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <FormGroup>
            <Label htmlFor="custom-ex-name">Nome do Exercício *</Label>
            <Input
              id="custom-ex-name"
              type="text"
              placeholder="Ex: Supino Declinado na Máquina"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <Label htmlFor="custom-ex-muscle">Grupo Muscular</Label>
              <Select
                id="custom-ex-muscle"
                value={primaryMuscle}
                onChange={(e) => setPrimaryMuscle(e.target.value as MuscleGroup)}
              >
                <option value="peito">Peito</option>
                <option value="costas">Costas</option>
                <option value="quadriceps">Quadríceps</option>
                <option value="isquiotibiais">Isquiotibiais (Posterior)</option>
                <option value="gluteos">Glúteos</option>
                <option value="ombros">Ombros</option>
                <option value="biceps">Bíceps</option>
                <option value="triceps">Tríceps</option>
                <option value="panturrilha">Panturrilha</option>
                <option value="abdomen">Abdômen</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="custom-ex-equipment">Equipamento</Label>
              <Select
                id="custom-ex-equipment"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value as EquipmentType)}
              >
                <option value="maquina">Máquina</option>
                <option value="cabo">Cabo / Polia</option>
                <option value="halteres">Halteres</option>
                <option value="barra">Barra</option>
                <option value="peso_corporal">Peso Corporal</option>
                <option value="outro">Outro</option>
              </Select>
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label htmlFor="custom-ex-type">Tipo de Movimento</Label>
              <Select
                id="custom-ex-type"
                value={type}
                onChange={(e) => setType(e.target.value as ExerciseType)}
              >
                <option value="composto">Composto (Multiarticular)</option>
                <option value="isolado">Isolado (Uniarticular)</option>
                <option value="abdominal">Abdominal</option>
                <option value="aerobico">Aeróbico</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="custom-ex-difficulty">Dificuldade</Label>
              <Select
                id="custom-ex-difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              >
                <option value="iniciante">Iniciante</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </Select>
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label htmlFor="custom-ex-instructions">Instruções de Execução (uma por linha)</Label>
            <TextArea
              id="custom-ex-instructions"
              placeholder="Ex: Posicionar os pés alinhados com o quadril..."
              value={instructionsText}
              onChange={(e) => setInstructionsText(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="custom-ex-safety">Avisos e Segurança da Coluna</Label>
            <Input
              id="custom-ex-safety"
              type="text"
              placeholder="Ex: Manter lombar apoiada no banco."
              value={safetyWarnings}
              onChange={(e) => setSafetyWarnings(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="custom-ex-setup">Regulagem do Aparelho</Label>
            <Input
              id="custom-ex-setup"
              type="text"
              placeholder="Ex: Ajustar o encosto na marcação 3."
              value={equipmentSetup}
              onChange={(e) => setEquipmentSetup(e.target.value)}
            />
          </FormGroup>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <Button type="button" variant="ghost" size="md" fullWidth onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="md" fullWidth>
              <Save size={18} />
              Salvar Exercício
            </Button>
          </div>
        </form>
      </Modal>
    </Overlay>
  );
};
