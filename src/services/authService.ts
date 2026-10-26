import { supabase, isSupabaseConfigured } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não está configurado.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName || 'Atleta Fênix',
      },
    },
  });

  if (error) {
    throw error;
  }

  return {
    user: data.user,
    session: data.session,
    needsEmailConfirmation: !data.session && !!data.user,
  };
}

export async function verifyEmailOtp(email: string, token: string) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não está configurado.');
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email: email.trim(),
    token: token.trim(),
    type: 'signup',
  });

  if (error) {
    // Tenta fallback com type 'email' se necessário
    const fallback = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: token.trim(),
      type: 'email',
    });
    if (fallback.error) {
      throw error;
    }
    return fallback.data;
  }

  return data;
}

export async function resendVerificationEmail(email: string) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não está configurado.');
  }

  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email: email.trim(),
  });

  if (error) throw error;
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não está configurado.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function signOutUser() {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPasswordForEmail(email: string) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não está configurado.');
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  });

  if (error) throw error;
  return data;
}

export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export function subscribeToAuthChanges(callback: (user: User | null, session: Session | null) => void) {
  if (!isSupabaseConfigured) {
    return { unsubscribe: () => {} };
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null, session);
  });

  return {
    unsubscribe: () => subscription.unsubscribe(),
  };
}
