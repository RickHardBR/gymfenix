-- ========================================================
-- FENIX GYM TRACKER - SCHEMA DO SUPABASE (POSTGRESQL)
-- Banco: GYM
-- ========================================================

-- Extensão nativa gen_random_uuid() já é padrão no PostgreSQL 13+ do Supabase.

-- 1. TABELA DE PERFIS DE USUÁRIOS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Atleta Fênix',
  main_goal TEXT DEFAULT 'Desenvolver força e massa muscular e melhorar a composição corporal',
  training_location TEXT DEFAULT 'Academia equipada com máquinas, cabos, halteres e barras',
  experience_level TEXT DEFAULT 'intermediario',
  weekly_frequency INT DEFAULT 3,
  method TEXT DEFAULT 'fullbody_abc',
  method_description TEXT DEFAULT 'Full Body com treinos alternados A, B e C (3x por semana)',
  min_duration INT DEFAULT 60,
  max_duration INT DEFAULT 90,
  days_inactive INT DEFAULT 14,
  lumbar_condition TEXT DEFAULT 'Sem dor no momento, mas com histórico de desconforto durante exercícios com cargas elevadas',
  current_pain BOOLEAN DEFAULT FALSE,
  pain_notes TEXT DEFAULT 'Evitar cargas máximas, focar em estabilidade e apoio lombar',
  priorities JSONB DEFAULT '["Segurança articular e postural", "Consistência e regularidade", "Progressão dupla de cargas sustentável", "Preservação e ganho de massa muscular", "Acompanhamento de força a longo prazo"]'::jsonb,
  settings JSONB DEFAULT '{"theme": "dark", "soundEnabled": true, "vibrationEnabled": true, "autoStartTimer": true, "restTimerDefaultSeconds": 90}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE EXERCÍCIOS
CREATE TABLE IF NOT EXISTS public.exercises (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL para exercícios públicos do sistema
  name TEXT NOT NULL,
  primary_muscle TEXT NOT NULL,
  secondary_muscles JSONB DEFAULT '[]'::jsonb,
  equipment TEXT NOT NULL,
  type TEXT NOT NULL,
  difficulty TEXT DEFAULT 'iniciante',
  instructions JSONB DEFAULT '[]'::jsonb,
  common_mistakes JSONB DEFAULT '[]'::jsonb,
  equipment_setup TEXT,
  alternatives JSONB DEFAULT '[]'::jsonb,
  safety_warnings TEXT,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE MODELOS DE TREINOS (A, B, C e Customizados)
CREATE TABLE IF NOT EXISTS public.workout_templates (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  estimated_duration_minutes INT DEFAULT 60,
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE SESSÕES EXECUTADAS
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL,
  template_name TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  finished_at TIMESTAMPTZ,
  duration_seconds INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'em_andamento',
  exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_volume_kg NUMERIC DEFAULT 0,
  total_working_sets INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABELA DE REGISTRO DE DORES E SEGURANÇA LOMBAR
CREATE TABLE IF NOT EXISTS public.pain_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  exercise_id TEXT,
  region TEXT NOT NULL,
  intensity INT CHECK (intensity >= 1 AND intensity <= 10),
  stopped BOOLEAN DEFAULT FALSE,
  notes TEXT,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABELA DE MEDIDAS CORPORAIS E PESO
CREATE TABLE IF NOT EXISTS public.body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg NUMERIC,
  waist_circumference_cm NUMERIC,
  notes TEXT,
  measured_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================================
-- POLÍTICAS DE SEGURANÇA ROW LEVEL SECURITY (RLS)
-- ========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pain_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;

-- Políticas para Profiles
CREATE POLICY "Usuário acessa o próprio perfil" ON public.profiles
  FOR ALL USING (auth.uid() = id);

  Error: Failed to run sql query: ERROR: 42710: policy "Usuário acessa o próprio perfil" for table "profiles" already exists

-- Políticas para Exercícios (exercícios do sistema com user_id NULL são visíveis a todos)
CREATE POLICY "Leitura de exercícios públicos e próprios" ON public.exercises
  FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "Inserção e edição de exercícios próprios" ON public.exercises
  FOR ALL USING (user_id = auth.uid());

-- Políticas para Workout Templates
CREATE POLICY "Usuário gerencia seus modelos de treino" ON public.workout_templates
  FOR ALL USING (user_id = auth.uid());

-- Políticas para Sessões
CREATE POLICY "Usuário gerencia suas sessões de treino" ON public.workout_sessions
  FOR ALL USING (user_id = auth.uid());

-- Políticas para Registro de Dor
CREATE POLICY "Usuário gerencia seus relatos de dor" ON public.pain_logs
  FOR ALL USING (user_id = auth.uid());

-- Políticas para Medidas Corporais
CREATE POLICY "Usuário gerencia suas medidas corporais" ON public.body_measurements
  FOR ALL USING (user_id = auth.uid());

-- ========================================================
-- TRIGGER PARA CRIAÇÃO AUTOMÁTICA DE PERFIL NO CADASTRO
-- ========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
