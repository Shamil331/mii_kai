import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

export function AuthPage() {
  const { user, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const [mode, setMode] = useState<'in' | 'up'>('in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (user) {
    return <Navigate to={from} replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setBusy(true)
    const err =
      mode === 'in' ? await signIn(email.trim(), password) : await signUp(email.trim(), password)
    setBusy(false)
    if (err) {
      setError(err)
      return
    }
    if (mode === 'up') {
      setInfo(
        'Аккаунт создан. Если в проекте включено подтверждение email — проверьте почту. Иначе можно сразу оформлять заказ.',
      )
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Link to="/" className="text-sm text-forest underline">
        ← К наборам
      </Link>
      <h1 className="mt-4 text-3xl font-semibold text-forest">
        {mode === 'in' ? 'Вход' : 'Регистрация'}
      </h1>
      <p className="mt-2 text-sm text-ink/65">
        Для сохранения заказа в Supabase нужен аккаунт (Auth + RLS).
      </p>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className={`min-h-11 flex-1 rounded-full text-sm ${
            mode === 'in' ? 'bg-forest text-white' : 'border border-stone bg-white'
          }`}
          onClick={() => setMode('in')}
        >
          Войти
        </button>
        <button
          type="button"
          className={`min-h-11 flex-1 rounded-full text-sm ${
            mode === 'up' ? 'bg-forest text-white' : 'border border-stone bg-white'
          }`}
          onClick={() => setMode('up')}
        >
          Регистрация
        </button>
      </div>

      <form className="mt-6 space-y-4 rounded-2xl border border-stone bg-white p-5" onSubmit={onSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-xl border border-stone px-3"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            autoComplete={mode === 'in' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 min-h-11 w-full rounded-xl border border-stone px-3"
          />
        </div>
        {error ? (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        ) : null}
        {info ? (
          <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{info}</p>
        ) : null}
        <button
          type="submit"
          disabled={busy}
          className="flex min-h-11 w-full items-center justify-center rounded-full bg-forest text-sm text-white disabled:opacity-60"
        >
          {busy ? 'Отправка…' : mode === 'in' ? 'Войти' : 'Создать аккаунт'}
        </button>
      </form>
    </div>
  )
}
