import type { Notification } from '../data/types'
import { isSupabaseConfigured, supabase } from './supabaseClient'

export async function fetchUserNotifications(
  userId: string,
): Promise<{ data: Notification[] | null; error: Error | null }> {
  if (!isSupabaseConfigured) {
    return { data: [], error: null }
  }

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error: new Error(error.message) }
  }

  const mapped: Notification[] = (data || []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    title: row.title,
    message: row.message,
    type: row.type,
    link: row.link,
    read: row.read,
    createdAt: row.created_at,
  }))

  return { data: mapped, error: null }
}

export async function markNotificationRead(
  notificationId: string,
): Promise<{ error: Error | null }> {
  if (!isSupabaseConfigured) return { error: null }

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)

  return { error: error ? new Error(error.message) : null }
}
