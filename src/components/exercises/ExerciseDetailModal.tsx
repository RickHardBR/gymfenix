import React from 'react';
import styled from 'styled-components';
import { X, ShieldCheck, AlertTriangle, Wrench, RefreshCw, CheckCircle2, Activity } from 'lucide-react';
import type { Exercise } from '../../types/workout';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ExerciseGuideDrawer } from './ExerciseGuideDrawer';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  @media (min-width: 768px) {
    align-items: center;
    padding: 20px;
  }
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => `${theme.radii.xl} ${theme.radii.xl} 0 0`};
  width: 100%;
  max-width: 580px;
  max-height: 88vh;
  overflow-y: auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  animation: slideUp 0.25s ease-out;

  @media (min-width: 768px) {
    border-radius: ${({ theme }) => theme.radii.xl};
    max-height: 85vh;
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

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const TitleCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ExerciseName = styled.h2`
  font-size: 1.35rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.radii.full};
  background: ${({ theme }) => theme.colors.surfaceHover};
  color: ${({ theme }) => theme.colors.textSecondary};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surfaceActive};
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text};
`;

const StepList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 20px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const MistakesList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 6px;
  list-style: none;
`;

const MistakeItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.danger};

  svg {
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const SafetyBox = styled.div`
  background: ${({ theme }) => theme.colors.successLight};
  border: 1px solid ${({ theme }) => theme.colors.success};
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;

  svg {
    color: ${({ theme }) => theme.colors.success};
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const SetupBox = styled.div`
  background: ${({ theme }) => theme.colors.surfaceHover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.text};

  svg {
    color: ${({ theme }) => theme.colors.accent};
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

interface ExerciseDetailModalProps {
  exercise: Exercise;
  onClose: () => void;
  onSelectAlternative?: (altId: string) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  onClose,
  onSelectAlternative,
}) => {
  const [isGuideOpen, setIsGuideOpen] = React.useState(false);

  return (
    <>
      <Overlay onClick={onClose} role="dialog" aria-modal="true" aria-label={`Detalhes de ${exercise.name}`}>
        <ModalContainer onClick={(e) => e.stopPropagation()}>
          <HeaderRow>
            <TitleCol>
              <ExerciseName>{exercise.name}</ExerciseName>
              <TagsRow>
                <Badge variant="primary">{exercise.primaryMuscle}</Badge>
                <Badge variant="accent">{exercise.equipment}</Badge>
                <Badge variant="neutral">{exercise.type}</Badge>
                {exercise.isCustom && <Badge variant="warning">Personalizado</Badge>}
              </TagsRow>
            </TitleCol>
            <CloseButton onClick={onClose} aria-label="Fechar detalhes">
              <X size={20} />
            </CloseButton>
          </HeaderRow>

          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => setIsGuideOpen(true)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Activity size={18} /> Ver Guia de Cadência & Anatomia
          </Button>

        {exercise.safetyWarnings && (
          <SafetyBox>
            <ShieldCheck size={18} />
            <div>
              <strong>Segurança e Coluna:</strong> {exercise.safetyWarnings}
            </div>
          </SafetyBox>
        )}

        {exercise.equipmentSetup && (
          <SetupBox>
            <Wrench size={18} />
            <div>
              <strong>Regulagem do Aparelho:</strong> {exercise.equipmentSetup}
            </div>
          </SetupBox>
        )}

        <Section>
          <SectionTitle>
            <CheckCircle2 size={18} color="#10b981" />
            Instruções de Execução
          </SectionTitle>
          <StepList>
            {exercise.instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </StepList>
        </Section>

        {exercise.commonMistakes.length > 0 && (
          <Section>
            <SectionTitle>
              <AlertTriangle size={18} color="#ef4444" />
              Erros Comuns a Evitar
            </SectionTitle>
            <MistakesList>
              {exercise.commonMistakes.map((mistake, idx) => (
                <MistakeItem key={idx}>
                  <AlertTriangle size={15} />
                  <span>{mistake}</span>
                </MistakeItem>
              ))}
            </MistakesList>
          </Section>
        )}

        {exercise.alternatives && exercise.alternatives.length > 0 && (
          <Section>
            <SectionTitle>
              <RefreshCw size={18} color="#f97316" />
              Alternativas Equivalentes
            </SectionTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              {exercise.alternatives.map((altId) => (
                <Button
                  key={altId}
                  variant="outline"
                  size="sm"
                  onClick={() => onSelectAlternative && onSelectAlternative(altId)}
                >
                  Substituir por: {altId.replace(/_/g, ' ')}
                </Button>
              ))}
            </div>
          </Section>
        )}

        <Button variant="secondary" size="md" fullWidth onClick={onClose}>
          Fechar
        </Button>
      </ModalContainer>
    </Overlay>

    <ExerciseGuideDrawer
      exercise={exercise}
      isOpen={isGuideOpen}
      onClose={() => setIsGuideOpen(false)}
    />
  </>
  );
};
