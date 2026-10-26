import React from 'react';
import styled from 'styled-components';
import { X, Calendar, Clock, Weight, Flame, AlertTriangle } from 'lucide-react';
import type { WorkoutSession } from '../../types/session';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface SessionDetailModalProps {
  session: WorkoutSession;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 200;
  animation: fadeIn 0.2s ease-out;

  @media (min-width: 600px) {
    align-items: center;
    padding: 16px;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  background-color: ${({ theme }) => theme.colors.surface};
  border-top-left-radius: ${({ theme }) => theme.radii.lg};
  border-top-right-radius: ${({ theme }) => theme.radii.lg};
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  @media (min-width: 600px) {
    border-radius: ${({ theme }) => theme.radii.lg};
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 6px;
  border-radius: ${({ theme }) => theme.radii.full};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 20px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.md};
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2px;
`;

const SummaryLabel = styled.span`
  font-size: 0.725rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SummaryValue = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const SectionTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 12px 0 8px 0;
`;

const ExerciseCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 12px;
  margin-bottom: 12px;
`;

const ExerciseName = styled.div`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SetsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;

  th {
    text-align: left;
    padding: 4px 6px;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: 600;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  td {
    padding: 6px;
    color: ${({ theme }) => theme.colors.text};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const PainBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: ${({ theme }) => theme.radii.sm};
  color: #ef4444;
  font-size: 0.775rem;
  font-weight: 600;
  margin-top: 8px;
`;

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  session,
  onClose,
}) => {
  const dateFormatted = new Date(session.startedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const durationMin = Math.round(session.durationSeconds / 60);

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <Header>
          <div>
            <Title>{session.templateName}</Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#888', marginTop: 4 }}>
              <Calendar size={13} />
              <span>{dateFormatted}</span>
            </div>
          </div>
          <CloseButton onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </CloseButton>
        </Header>

        <SummaryGrid>
          <SummaryItem>
            <SummaryLabel>
              <Clock size={12} /> Duração
            </SummaryLabel>
            <SummaryValue>{durationMin} min</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>
              <Weight size={12} /> Volume Total
            </SummaryLabel>
            <SummaryValue>{session.totalVolumeKg} kg</SummaryValue>
          </SummaryItem>
          <SummaryItem>
            <SummaryLabel>
              <Flame size={12} /> Séries Efetivas
            </SummaryLabel>
            <SummaryValue>{session.totalWorkingSets}</SummaryValue>
          </SummaryItem>
        </SummaryGrid>

        <SectionTitle>Exercícios Executados</SectionTitle>

        {session.exercises.map((ex, index) => {
          const completedSets = ex.sets.filter((s) => s.isCompleted);
          return (
            <ExerciseCard key={`${ex.exerciseId}_${index}`}>
              <ExerciseName>
                <span>{ex.exerciseName}</span>
                <Badge variant={completedSets.length > 0 ? 'success' : 'neutral'}>
                  {completedSets.length} séries
                </Badge>
              </ExerciseName>

              {completedSets.length > 0 ? (
                <SetsTable>
                  <thead>
                    <tr>
                      <th>Série</th>
                      <th>Tipo</th>
                      <th>Carga</th>
                      <th>Reps</th>
                      <th>RIR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedSets.map((s) => (
                      <tr key={s.id}>
                        <td>#{s.setNumber}</td>
                        <td>{s.type === 'aquecimento' ? 'Aquec.' : 'Trabalho'}</td>
                        <td>{s.weightKg} kg</td>
                        <td>{s.reps}</td>
                        <td>{s.rir}</td>
                      </tr>
                    ))}
                  </tbody>
                </SetsTable>
              ) : (
                <div style={{ fontSize: '0.8rem', color: '#888' }}>
                  Nenhuma série concluída.
                </div>
              )}

              {ex.painReport && (
                <PainBanner>
                  <AlertTriangle size={14} />
                  <span>
                    Relato de dor na região: <strong>{ex.painReport.region}</strong> (Intensidade {ex.painReport.intensity}/10).
                    {ex.painReport.notes ? ` Obs: "${ex.painReport.notes}"` : ''}
                  </span>
                </PainBanner>
              )}
            </ExerciseCard>
          );
        })}

        <Button variant="outline" onClick={onClose} style={{ marginTop: 12 }}>
          Fechar
        </Button>
      </ModalContainer>
    </Overlay>
  );
};
