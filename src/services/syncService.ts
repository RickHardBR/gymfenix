import { supabase, isSupabaseConfigured } from './supabase';
import { getDB } from './db';
import type { UserProfile } from '../types/profile';
import type { WorkoutSession } from '../types/session';

export interface SyncStatus {
  lastSync: Date | null;
  isSyncing: boolean;
  pendingCount: number;
  error: string | null;
}

export function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

/**
 * Sincroniza o perfil do usuário local com a nuvem (Supabase)
 */
export async function syncUserProfileToCloud(profile: UserProfile, userId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !isOnline() || !userId) return false;

  try {
    const { error } = await supabase.from('profiles').upsert({
      id: userId,
      name: profile.name,
      main_goal: profile.mainGoal,
      training_location: profile.trainingLocation,
      experience_level: profile.experienceLevel,
      weekly_frequency: profile.weeklyFrequency,
      method: profile.method,
      method_description: profile.methodDescription,
      min_duration: profile.availableDurationMinutes?.min ?? 60,
      max_duration: profile.availableDurationMinutes?.max ?? 90,
      days_inactive: profile.initialStatus?.daysInactive ?? 14,
      lumbar_condition: profile.initialStatus?.lumbarCondition ?? '',
      current_pain: profile.initialStatus?.currentPain ?? false,
      pain_notes: profile.initialStatus?.painNotes ?? '',
      priorities: profile.priorities,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.warn('Erro ao sincronizar perfil no Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exceção ao sincronizar perfil no Supabase:', err);
    return false;
  }
}

/**
 * Envia uma sessão concluída para o Supabase
 */
export async function syncSessionToCloud(session: WorkoutSession, userId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !isOnline() || !userId) return false;

  try {
    const { error } = await supabase.from('workout_sessions').upsert({
      id: session.id,
      user_id: userId,
      template_id: session.templateId,
      template_name: session.templateName,
      started_at: session.startedAt,
      finished_at: session.finishedAt,
      duration_seconds: session.durationSeconds,
      status: session.status,
      exercises: session.exercises,
      total_volume_kg: session.totalVolumeKg,
      total_working_sets: session.totalWorkingSets,
      notes: session.notes,
    });

    if (error) {
      console.warn('Erro ao sincronizar sessão no Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exceção ao sincronizar sessão no Supabase:', err);
    return false;
  }
}

/**
 * Sincronização bidirecional das sessões de treino:
 * 1. Envia sessões locais para o Supabase
 * 2. Baixa sessões do Supabase que ainda não existem localmente
 */
export async function syncAllSessionsWithCloud(userId: string): Promise<{ syncedCount: number; downloadedCount: number }> {
  if (!isSupabaseConfigured || !isOnline() || !userId) {
    return { syncedCount: 0, downloadedCount: 0 };
  }

  const db = await getDB();
  let syncedCount = 0;
  let downloadedCount = 0;

  // 1. Obter todas as sessões locais concluídas
  const localSessionsRaw = await db.getAll('sessions');
  const localSessions = localSessionsRaw as unknown as WorkoutSession[];
  const finishedLocal = localSessions.filter((s) => s.status === 'concluido');

  // Enviar locais para a nuvem
  for (const session of finishedLocal) {
    const success = await syncSessionToCloud(session, userId);
    if (success) syncedCount++;
  }

  // 2. Baixar sessões remotas
  try {
    const { data: remoteSessions, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId);

    if (!error && remoteSessions) {
      const localMap = new Map(localSessions.map((s) => [s.id, s]));

      for (const remote of remoteSessions) {
        if (!localMap.has(remote.id)) {
          const sessionToSave: WorkoutSession = {
            id: remote.id,
            templateId: remote.template_id,
            templateName: remote.template_name,
            startedAt: remote.started_at,
            finishedAt: remote.finished_at,
            durationSeconds: remote.duration_seconds || 0,
            status: remote.status,
            exercises: remote.exercises || [],
            totalVolumeKg: Number(remote.total_volume_kg) || 0,
            totalWorkingSets: remote.total_working_sets || 0,
            notes: remote.notes,
          };
          await db.put('sessions', sessionToSave as unknown as any);
          downloadedCount++;
        }
      }
    }
  } catch (err) {
    console.warn('Erro ao baixar sessões do Supabase:', err);
  }

  return { syncedCount, downloadedCount };
}
