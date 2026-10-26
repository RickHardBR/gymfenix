import React from 'react';
import styled, { useTheme } from 'styled-components';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Layers, Info } from 'lucide-react';
import type { WorkoutSession } from '../../types/session';
import type { Exercise } from '../../types/workout';
import { calculateMuscleVolumeDistribution } from '../../utils/progressionEngine';
import { Card } from '../common/Card';

interface MuscleVolumeChartProps {
  sessions: WorkoutSession[];
  catalog: Exercise[];
}

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  font-size: 0.95rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
`;

const Subtitle = styled.span`
  font-size: 0.775rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const GraphWrapper = styled.div`
  width: 100%;
  height: 240px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 180px;
  text-align: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.875rem;
  background: ${({ theme }) => theme.colors.surfaceHover};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 16px;
`;

const TooltipBox = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.8rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const MuscleVolumeChart: React.FC<MuscleVolumeChartProps> = ({
  sessions,
  catalog,
}) => {
  const theme = useTheme();

  const data = React.useMemo(() => {
    return calculateMuscleVolumeDistribution(sessions, catalog, 30);
  }, [sessions, catalog]);

  return (
    <Card>
      <ChartHeader>
        <Title>
          <Layers size={16} />
          Volume por Grupo Muscular
        </Title>
        <Subtitle>Últimos 30 dias</Subtitle>
      </ChartHeader>

      {data.length === 0 ? (
        <EmptyState>
          <Info size={24} />
          <span>Nenhum volume registrado nos últimos 30 dias.</span>
        </EmptyState>
      ) : (
        <GraphWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 25, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} horizontal={false} />
              <XAxis
                type="number"
                stroke={theme.colors.textSecondary}
                fontSize={11}
                tickLine={false}
                unit="kg"
              />
              <YAxis
                type="category"
                dataKey="label"
                stroke={theme.colors.textSecondary}
                fontSize={11}
                tickLine={false}
                width={70}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <TooltipBox>
                        <strong style={{ color: theme.colors.primary }}>{item.label}</strong>
                        <div>Tonelagem: {item.volumeKg} kg</div>
                        <div>Séries Efetivas: {item.workingSets}</div>
                      </TooltipBox>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="volumeKg" fill={theme.colors.primary} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GraphWrapper>
      )}
    </Card>
  );
};
