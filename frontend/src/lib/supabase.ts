import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Check frontend/.env',
  )
}

export const supabase = createClient<Database>(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export function mapSupabaseError(error: { message: string; code?: string } | null): string {
  if (!error) return 'Неизвестная ошибка сервера'
  const msg = error.message.toLowerCase()
  if (error.code === '42501' || msg.includes('row-level security')) {
    return 'Нет доступа (403). Войдите в аккаунт и попробуйте снова.'
  }
  if (msg.includes('jwt') || msg.includes('not authenticated') || error.code === 'PGRST301') {
    return 'Требуется вход (401). Зарегистрируйтесь или войдите.'
  }
  if (msg.includes('failed to fetch') || msg.includes('network')) {
    return 'Сеть недоступна. Проверьте соединение и повторите.'
  }
  return error.message
}
