import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Dumbbell, Info } from 'lucide-react';
import type { WorkoutSession } from '../../types/session';
import type { Exercise } from '../../types/workout';
import { getExerciseProgressHistory } from '../../utils/progressionEngine';
import { Card } from '../common/Card';

interface ExerciseProgressChartProps {
  sessions: WorkoutSession[];
  catalog: Exercise[];
}

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SelectGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const GraphWrapper = styled.div`
  width: 100%;
  height: 260px;
  margin-top: 8px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
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
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  font-size: 0.8rem;
`;

const TooltipDate = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

const TooltipRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 2px;
`;

export const ExerciseProgressChart: React.FC<ExerciseProgressChartProps> = ({
  sessions,
  catalog,
}) => {
  const theme = useTheme();

  // Filtra exercícios que possuem ao menos uma sessão registrada
  const recordedExerciseIds = React.useMemo(() => {
    const ids = new Set<string>();
    sessions.forEach((s) => {
      if (s.status === 'concluido') {
        s.exercises.forEach((ex) => {
          if (ex.sets.some((set) => set.isCompleted && set.type === 'trabalho')) {
            ids.add(ex.exerciseId);
          }
        });
      }
    });
    return Array.from(ids);
  }, [sessions]);

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');

  const defaultExerciseId = recordedExerciseIds[0] || (catalog[0] ? catalog[0].id : '');
  const activeExerciseId =
    selectedExerciseId && (recordedExerciseIds.includes(selectedExerciseId) || catalog.some((c) => c.id === selectedExerciseId))
      ? selectedExerciseId
      : defaultExerciseId;

  const historyPoints = React.useMemo(() => {
    if (!activeExerciseId) return [];
    return getExerciseProgressHistory(activeExerciseId, sessions);
  }, [activeExerciseId, sessions]);

  return (
    <Card>
      <ChartContainer>
        <SelectGroup>
          <Label htmlFor="exercise-select">
            <Dumbbell size={16} />
            Evolução de Cargas & 1RM Estimado
          </Label>
          <StyledSelect
            id="exercise-select"
            value={activeExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
          >
            {recordedExerciseIds.length > 0 ? (
              recordedExerciseIds.map((id) => {
                const ex = catalog.find((c) => c.id === id);
                return (
                  <option key={id} value={id}>
                    {ex ? ex.name : id.replace(/_/g, ' ')}
                  </option>
                );
              })
            ) : (
              catalog.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))
            )}
          </StyledSelect>
        </SelectGroup>

        {historyPoints.length === 0 ? (
          <EmptyState>
            <Info size={24} />
            <span>Nenhum treino concluído com este exercício ainda.</span>
            <span style={{ fontSize: '0.775rem' }}>
              Ao finalizar suas sessões, você verá o gráfico de evolução de carga aqui.
            </span>
          </EmptyState>
        ) : (
          <GraphWrapper>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} />
                <XAxis
                  dataKey="date"
                  stroke={theme.colors.textSecondary}
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke={theme.colors.textSecondary}
                  fontSize={12}
                  tickLine={false}
                  domain={['auto', 'auto']}
                  unit="kg"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <TooltipBox>
                          <TooltipDate>
                            {data.date} — {data.sessionName}
                          </TooltipDate>
                          <TooltipRow>
                            <span>Carga Máxima:</span>
                            <strong>{data.maxWeightKg} kg</strong>
                          </TooltipRow>
                          <TooltipRow>
                            <span>1RM Estimado:</span>
                            <strong style={{ color: theme.colors.primary }}>
                              {data.estimated1RM} kg
                            </strong>
                          </TooltipRow>
                          <TooltipRow>
                            <span>Volume Total:</span>
                            <span>{data.volumeKg} kg</span>
                          </TooltipRow>
                          <TooltipRow>
                            <span>RIR Médio:</span>
                            <span>{data.avgRir}</span>
                          </TooltipRow>
                        </TooltipBox>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '0.8rem', paddingTop: '8px' }}
                  formatter={(value) => (value === 'maxWeightKg' ? 'Carga Máx (kg)' : '1RM Estimado (kg)')}
                />
                <Line
                  type="monotone"
                  dataKey="maxWeightKg"
                  stroke={theme.colors.primary}
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: theme.colors.primary }}
                  activeDot={{ r: 6 }}
                  name="maxWeightKg"
                />
                <Line
                  type="monotone"
                  dataKey="estimated1RM"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#3b82f6' }}
                  name="estimated1RM"
                />
              </LineChart>
            </ResponsiveContainer>
          </GraphWrapper>
        )}
      </ChartContainer>
    </Card>
  );
};
