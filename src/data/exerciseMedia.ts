/**
 * Mapeamento oficial de mídias de alta fidelidade para os exercícios do Fênix Gym.
 *
 * Fonte oficial:
 * 1. Fotos Reais Fase A (0.jpg) e Fase B (1.jpg): Repositório open-source Free Exercise DB (yuhonas / GitHub).
 * 2. Animação Técnica em Loop: Interpolação suave e sincronizada das poses anatômicas reais ou GIFs diretos.
 */

export interface ExerciseMediaData {
  imagePhaseA: string; // Posição Inicial / Alongamento
  imagePhaseB: string; // Pico de Contração
  gifUrl?: string; // GIF / Demonstração contínua
  exerciseSlug: string;
}

const RAW_BASE_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

export const EXERCISE_MEDIA_MAP: Record<string, ExerciseMediaData> = {
  // 1. Leg Press 45°
  leg_press_45: {
    exerciseSlug: 'Leg_Press',
    imagePhaseA: `${RAW_BASE_URL}Leg_Press/0.jpg`,
    imagePhaseB: `${RAW_BASE_URL}Leg_Press/1.jpg`,
  },

  // 2. Supino em Máquina
  supino_maquina: {
    exerciseSlug: 'Leverage_Chest_Press',
    imagePhaseA: `${RAW_BASE_URL}Leverage_Chest_Press/0.jpg`,
    imagePhaseB: `${RAW_BASE_URL}Leverage_Chest_Press/1.jpg`,
  },

  // 3. Remada Sentada com Apoio no Peito (Machine Iso Row)
  remada_sentada_apoio: {
    exerciseSlug: 'Leverage_Iso_Row',
    imagePhaseA: `${RAW_BASE_URL}Leverage_Iso_Row/0.jpg`,
    imagePhaseB: `${RAW_BASE_URL}Leverage_Iso_Row/1.jpg`,
  },

  // 4. Mesa Flexora (Deitado)
  mesa_flexora: {
    exerciseSlug: 'Lying_Leg_Curls',
    imagePhaseA: `${RAW_BASE_URL}Lying_Leg_Curls/0.jpg`,
    imagePhaseB: `${RAW_BASE_URL}Lying_Leg_Curls/1.jpg`,
  },

  // 5. Elevação Lateral
  elevacao_lateral: {
    exerciseSlug: 'Side_Lateral_Raise',
    imagePhaseA: `${RAW_BASE_URL}Side_Lateral_Raise/0.jpg`,
    imagePhaseB: `${RAW_BASE_URL}Side_Lateral_Raise/1.jpg`,
  },

  // 6. Abdominal na Máquina
  abdominal_maquina: {
    exerciseSlug: 'Ab_Crunch_Machine',
    imagePhaseA: `${RAW_BASE_URL}Ab_Crunch_Machine/0.jpg`,
    imagePhaseB: `${RAW_BASE_URL}Ab_Crunch_Machine/1.jpg`,
  },

  // 7. Cadeira Extensora
  cadeira_extensora: {
    exerciseSlug: 'Leg_Extensions',
    imagePhaseA: `${RAW_BASE_URL}Leg_Extensions/0.jpg`,
    imagePhaseB: `${RAW_BASE_URL}Leg_Extensions/1.jpg`,
  },

  // 8. Puxada Alta (Lat Pulldown)
  puxada_alta: {
    exerciseSlug: 'Wide-Grip_Lat_Pulldown',
    imagePhaseA: `${RAW_BASE_URL}Wide-Grip_Lat_Pulldown/0.jpg`,
    imagePhaseB: `${RAW_BASE_URL}Wide-Grip_Lat_Pulldown/1.jpg`,
  },

  // 9. Supino Inclinado em Máquina
  supino_inclinado_maquina: {
    exerciseSlug: 'Leverage_Incline_Chest_Press',
    imagePhaseA: `${RAW_BASE_URL}Leverage_Incline_Chest_Press/0.jpg`,
    imagePhaseB: `${RAW_BASE_URL}Leverage_Incline_Chest_Press/1.jpg`,
  },

  // 10. Cadeira Flexora (Sentada)
  flexora_sentada: {
    exerciseSlug: 'Seated_Leg_Curl',
    imagePhaseA: `${RAW_BASE_URL}Seated_Leg_Curl/0.jpg`,
    imagePhaseB: `${RAW_BASE_URL}Seated_Leg_Curl/1.jpg`,
  },

  // 11. Rosca Bíceps
  rosca_biceps: {
    exerciseSlug: 'Dumbbell_Bicep_Curl',
    imagePhaseA: `${RAW_BASE_URL}Dumbbell_Bicep_Curl/0.jpg`,
    imagePhaseB: `${RAW_BASE_URL}Dumbbell_Bicep_Curl/1.jpg`,
  },

  // 12. Tríceps na Polia com Cabo
  triceps_cabo: {
    exerciseSlug: 'Cable_One_Arm_Tricep_Extension',
    imagePhaseA: `${RAW_BASE_URL}Cable_One_Arm_Tricep_Extension/0.jpg`,
    imagePhaseB: `${RAW_BASE_URL}Cable_One_Arm_Tricep_Extension/1.jpg`,
  },

  // 13. Elevação Pélvica / Hip Thrust
  elevacao_pelvica_maquina: {
    exerciseSlug: 'Barbell_Hip_Thrust',
    imagePhaseA: `${RAW_BASE_URL}Barbell_Hip_Thrust/0.jpg`,
    imagePhaseB: `${RAW_BASE_URL}Barbell_Hip_Thrust/1.jpg`,
  },

  // 14. Panturrilha Sentada em Máquina
  panturrilha_sentada: {
    exerciseSlug: 'Seated_Calf_Raise',
    imagePhaseA: `${RAW_BASE_URL}Seated_Calf_Raise/0.jpg`,
    imagePhaseB: `${RAW_BASE_URL}Seated_Calf_Raise/1.jpg`,
  },
};

export const getExerciseMedia = (exerciseId: string): ExerciseMediaData => {
  if (EXERCISE_MEDIA_MAP[exerciseId]) {
    return EXERCISE_MEDIA_MAP[exerciseId];
  }

  // Fallback padrão seguro (Leg Press)
  return {
    exerciseSlug: 'Leg_Press',
    imagePhaseA: `${RAW_BASE_URL}Leg_Press/0.jpg`,
    imagePhaseB: `${RAW_BASE_URL}Leg_Press/1.jpg`,
  };
};
