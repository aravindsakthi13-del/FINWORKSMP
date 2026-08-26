import type { Session, User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from './supabaseClient'

export type UserRole = 'candidate' | 'recruiter' | 'admin'

export interface UserProfile {
  id: string
  email: string
  name: string
  role: UserRole
  created_at?: string
}

export interface SignUpParams {
  email: string
  password: string
  name: string
  role: UserRole
}

export interface SignInParams {
  email: string
  password: string
}

export async function signUp({
  email,
  password,
  name,
  role,
}: SignUpParams): Promise<{ user: User | null; profile: UserProfile | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return {
      user: null,
      profile: null,
      error: new Error(
        'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env',
      ),
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      },
    },
  })

  if (error) {
    return { user: null, profile: null, error: new Error(error.message) }
  }

  if (!data.user) {
    return { user: null, profile: null, error: new Error('User creation failed.') }
  }

  // Ensure profile row exists
  const profile: UserProfile = {
    id: data.user.id,
    email: data.user.email || email,
    name,
    role,
  }

  await supabase.from('profiles').upsert([profile])

  return { user: data.user, profile, error: null }
}

export async function signIn({
  email,
  password,
}: SignInParams): Promise<{ user: User | null; profile: UserProfile | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return {
      user: null,
      profile: null,
      error: new Error(
        'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env',
      ),
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { user: null, profile: null, error: new Error(error.message) }
  }

  if (!data.user) {
    return { user: null, profile: null, error: new Error('Authentication failed.') }
  }

  const profile = await getUserProfile(data.user.id)
  return { user: data.user, profile, error: null }
}

export async function signOut(): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) return { error: null }
  const { error } = await supabase.auth.signOut()
  return { error: error ? new Error(error.message) : null }
}

export async function getSession(): Promise<Session | null> {
  if (!isSupabaseConfigured) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data as UserProfile
}

export function onAuthStateChange(
  callback: (session: Session | null, profile: UserProfile | null) => void,
) {
  if (!isSupabaseConfigured) return { unsubscribe: () => {} }

  const { data: authListener } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      if (session?.user) {
        const profile = await getUserProfile(session.user.id)
        callback(session, profile)
      } else {
        callback(null, null)
      }
    },
  )

  return {
    unsubscribe: () => {
      authListener.subscription.unsubscribe()
    },
  }
}
