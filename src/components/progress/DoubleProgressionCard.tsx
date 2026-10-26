import React from 'react';
import styled from 'styled-components';
import { TrendingUp, AlertTriangle, CheckCircle, ArrowUpRight, ShieldCheck } from 'lucide-react';
import type { ProgressionRecommendation } from '../../utils/progressionEngine';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface DoubleProgressionCardProps {
  exerciseName: string;
  recommendation: ProgressionRecommendation;
}

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ExerciseTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const TargetRange = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatusBanner = styled.div<{ $status: ProgressionRecommendation['status'] }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 12px;

  ${({ $status, theme }) => {
    switch ($status) {
      case 'aumentar_carga':
        return `
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.35);
        `;
      case 'reduzir_deload_dor':
        return `
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.35);
        `;
      case 'progredir_reps':
        return `
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          border: 1px solid rgba(59, 130, 246, 0.35);
        `;
      default:
        return `
          background: ${theme.colors.surfaceHover};
          color: ${theme.colors.textSecondary};
          border: 1px solid ${theme.colors.border};
        `;
    }
  }}
`;

const DetailText = styled.p`
  font-size: 0.825rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.45;
  margin: 0 0 12px 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  padding: 10px;
  border-radius: ${({ theme }) => theme.radii.md};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 2px;
`;

const StatLabel = styled.span`
  font-size: 0.725rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatValue = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

export const DoubleProgressionCard: React.FC<DoubleProgressionCardProps> = ({
  exerciseName,
  recommendation,
}) => {
  const {
    status,
    currentWeightKg,
    suggestedWeightKg,
    targetMinReps,
    targetMaxReps,
    completedReps,
    message,
    detail,
  } = recommendation;

  const renderBadge = () => {
    switch (status) {
      case 'aumentar_carga':
        return (
          <Badge variant="success">
            <ArrowUpRight size={13} style={{ marginRight: 4 }} />
            Subir Carga
          </Badge>
        );
      case 'reduzir_deload_dor':
        return (
          <Badge variant="danger">
            <AlertTriangle size={13} style={{ marginRight: 4 }} />
            Cuidado Lombar
          </Badge>
        );
      case 'progredir_reps':
        return (
          <Badge variant="primary">
            <TrendingUp size={13} style={{ marginRight: 4 }} />
            Buscar Reps
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral">
            <ShieldCheck size={13} style={{ marginRight: 4 }} />
            Consolidar
          </Badge>
        );
    }
  };

  const renderIcon = () => {
    switch (status) {
      case 'aumentar_carga':
        return <CheckCircle size={18} />;
      case 'reduzir_deload_dor':
        return <AlertTriangle size={18} />;
      default:
        return <TrendingUp size={18} />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <TitleContainer>
          <ExerciseTitle>{exerciseName}</ExerciseTitle>
          <TargetRange>
            Faixa Alvo: {targetMinReps} a {targetMaxReps} repetições
          </TargetRange>
        </TitleContainer>
        {renderBadge()}
      </CardHeader>

      <StatusBanner $status={status}>
        {renderIcon()}
        <span>{message}</span>
      </StatusBanner>

      <DetailText>{detail}</DetailText>

      {status !== 'dados_insuficientes' && (
        <StatsGrid>
          <StatItem>
            <StatLabel>Última Carga</StatLabel>
            <StatValue>{currentWeightKg} kg</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Séries Realizadas</StatLabel>
            <StatValue>
              {completedReps.length > 0 ? completedReps.join(' - ') : '-'}
            </StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Sugerido Próximo</StatLabel>
            <StatValue style={{ color: status === 'aumentar_carga' ? '#22c55e' : 'inherit' }}>
              {suggestedWeightKg} kg
            </StatValue>
          </StatItem>
        </StatsGrid>
      )}
    </Card>
  );
};
