import { describe, it, expect, beforeEach } from 'vitest';
import { getAllExercises, getExerciseById, saveExercise, deleteExercise } from './exerciseService';
import type { Exercise } from '../types/workout';

describe('Exercise Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('retorna a lista de exercícios padrão quando inicializado', async () => {
    const exercises = await getAllExercises();
    expect(exercises.length).toBeGreaterThanOrEqual(14);
    expect(exercises.some((e) => e.id === 'leg_press_45')).toBe(true);
    expect(exercises.some((e) => e.id === 'supino_maquina')).toBe(true);
  });

  it('permite buscar exercício específico por ID', async () => {
    const ex = await getExerciseById('remada_sentada_apoio');
    expect(ex).toBeDefined();
    expect(ex?.name).toBe('Remada Sentada com Apoio no Peito');
    expect(ex?.primaryMuscle).toBe('costas');
  });

  it('permite cadastrar, atualizar e deletar um exercício customizado', async () => {
    const customExercise: Exercise = {
      id: 'custom_elevacao_pelvica_solo',
      name: 'Ponte de Glúteo no Solo',
      primaryMuscle: 'gluteos',
      secondaryMuscles: ['isquiotibiais'],
      equipment: 'peso_corporal',
      type: 'isolado',
      difficulty: 'iniciante',
      instructions: ['Deitar no solo e elevar o quadril contraindo os glúteos.'],
      commonMistakes: ['Arquear a lombar.'],
      equipmentSetup: 'Colchonete no solo.',
      alternatives: [],
      safetyWarnings: 'Excelente para quem não pode usar cargas pesadas.',
      isCustom: true,
      createdAt: new Date().toISOString(),
    };

    await saveExercise(customExercise);
    const retrieved = await getExerciseById('custom_elevacao_pelvica_solo');
    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe('Ponte de Glúteo no Solo');

    await deleteExercise('custom_elevacao_pelvica_solo');
    const afterDelete = await getExerciseById('custom_elevacao_pelvica_solo');
    expect(afterDelete).toBeUndefined();
  });
});
