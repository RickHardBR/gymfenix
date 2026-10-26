import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Search, Plus, BookOpen, ChevronRight, Filter } from 'lucide-react';
import type { Exercise, MuscleGroup } from '../../types/workout';
import { getAllExercises, saveExercise } from '../../services/exerciseService';
import { useApp } from '../../context/AppContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { CustomExerciseModal } from './CustomExerciseModal';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 40px;
`;

const HeaderSection = styled.div`
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

const SearchBarWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 12px 14px 12px 42px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.borderFocus};
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const FiltersScroll = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    height: 4px;
  }
`;

const FilterPill = styled.button<{ $active: boolean }>`
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  background: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.surface)};
  color: ${({ theme, $active }) => ($active ? '#ffffff' : theme.colors.textSecondary)};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  transition: all 0.15s ease;

  &:hover {
    color: ${({ theme, $active }) => ($active ? '#ffffff' : theme.colors.text)};
    background: ${({ theme, $active }) => ($active ? theme.colors.primaryHover : theme.colors.surfaceHover)};
  }
`;

const SecondaryFiltersRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SelectFilter = styled.select`
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 6px 10px;
  font-size: 0.8rem;
  outline: none;
`;

const ExerciseGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ExerciseCard = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.15s;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }
`;

const ExerciseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ExerciseTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const ExerciseBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const MuscleTranslation: Record<MuscleGroup, string> = {
  peito: 'Peito',
  costas: 'Costas',
  quadriceps: 'Quadríceps',
  isquiotibiais: 'Posterior de Coxa',
  gluteos: 'Glúteos',
  ombros: 'Ombros',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  panturrilha: 'Panturrilha',
  abdomen: 'Abdômen',
  corpo_inteiro: 'Corpo Inteiro',
};

export const ExerciseListScreen: React.FC = () => {
  const { showFeedback } = useApp();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('todos');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('todos');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchExercises = async () => {
      const data = await getAllExercises();
      if (isMounted) setExercises(data);
    };
    fetchExercises();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveCustomExercise = async (newEx: Exercise) => {
    await saveExercise(newEx);
    setExercises((prev) => [newEx, ...prev]);
    showFeedback(`Exercício "${newEx.name}" cadastrado!`);
  };

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMuscle =
        selectedMuscle === 'todos' || ex.primaryMuscle === selectedMuscle;
      const matchesEquipment =
        selectedEquipment === 'todos' || ex.equipment === selectedEquipment;
      return matchesSearch && matchesMuscle && matchesEquipment;
    });
  }, [exercises, searchTerm, selectedMuscle, selectedEquipment]);

  const muscleFilters: { id: string; label: string }[] = [
    { id: 'todos', label: 'Todos os Músculos' },
    { id: 'peito', label: 'Peito' },
    { id: 'costas', label: 'Costas' },
    { id: 'quadriceps', label: 'Quadríceps' },
    { id: 'isquiotibiais', label: 'Isquiotibiais' },
    { id: 'gluteos', label: 'Glúteos' },
    { id: 'ombros', label: 'Ombros' },
    { id: 'biceps', label: 'Bíceps' },
    { id: 'triceps', label: 'Tríceps' },
    { id: 'panturrilha', label: 'Panturrilha' },
    { id: 'abdomen', label: 'Abdômen' },
  ];

  return (
    <Container>
      <HeaderSection>
        <TitleCol>
          <Title>Biblioteca de Exercícios</Title>
          <Subtitle>{filteredExercises.length} exercícios disponíveis</Subtitle>
        </TitleCol>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCustomModalOpen(true)}
          aria-label="Cadastrar novo exercício"
        >
          <Plus size={16} />
          Novo
        </Button>
      </HeaderSection>

      {/* Busca rápida */}
      <SearchBarWrapper>
        <SearchIconWrapper>
          <Search size={18} />
        </SearchIconWrapper>
        <SearchInput
          type="search"
          placeholder="Buscar exercício por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Buscar exercício por nome"
        />
      </SearchBarWrapper>

      {/* Filtros em carrossel por Músculo */}
      <FiltersScroll>
        {muscleFilters.map((m) => (
          <FilterPill
            key={m.id}
            $active={selectedMuscle === m.id}
            onClick={() => setSelectedMuscle(m.id)}
          >
            {m.label}
          </FilterPill>
        ))}
      </FiltersScroll>

      {/* Filtro secundário por Equipamento */}
      <SecondaryFiltersRow>
        <Filter size={15} />
        <span>Equipamento:</span>
        <SelectFilter
          aria-label="Filtrar por equipamento"
          value={selectedEquipment}
          onChange={(e) => setSelectedEquipment(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="maquina">Máquinas com Apoio</option>
          <option value="cabo">Cabos e Polias</option>
          <option value="halteres">Halteres</option>
          <option value="barra">Barra</option>
          <option value="peso_corporal">Peso Corporal</option>
        </SelectFilter>
      </SecondaryFiltersRow>

      {/* Lista de Exercícios */}
      <ExerciseGrid>
        {filteredExercises.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '30px 20px' }}>
            <BookOpen size={32} style={{ color: '#9ca3af', margin: '0 auto 10px' }} />
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
              Nenhum exercício encontrado com esses filtros.
            </p>
          </Card>
        ) : (
          filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              onClick={() => setActiveExercise(exercise)}
              role="button"
              tabIndex={0}
              aria-label={`Ver detalhes de ${exercise.name}`}
            >
              <ExerciseInfo>
                <ExerciseTitle>{exercise.name}</ExerciseTitle>
                <ExerciseBadges>
                  <Badge variant="primary">
                    {MuscleTranslation[exercise.primaryMuscle] || exercise.primaryMuscle}
                  </Badge>
                  <Badge variant="neutral">{exercise.equipment}</Badge>
                  <Badge variant="accent">{exercise.type}</Badge>
                  {exercise.isCustom && <Badge variant="warning">Personalizado</Badge>}
                </ExerciseBadges>
              </ExerciseInfo>
              <ChevronRight size={18} style={{ color: '#6b7280' }} />
            </ExerciseCard>
          ))
        )}
      </ExerciseGrid>

      {/* Modais */}
      {activeExercise && (
        <ExerciseDetailModal
          exercise={activeExercise}
          onClose={() => setActiveExercise(null)}
          onSelectAlternative={(altId) => {
            const alt = exercises.find((e) => e.id === altId);
            if (alt) setActiveExercise(alt);
          }}
        />
      )}

      {isCustomModalOpen && (
        <CustomExerciseModal
          onClose={() => setIsCustomModalOpen(false)}
          onSave={handleSaveCustomExercise}
        />
      )}
    </Container>
  );
};
