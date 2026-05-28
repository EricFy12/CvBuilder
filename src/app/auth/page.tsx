'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Sparkles, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AuthPage() {
  const [view, setView] = useState<'login' | 'signup' | 'recovery'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!email) {
      setErrorMessage('Por favor, ingresa tu correo electrónico.')
      setLoading(false)
      return
    }

    if (view !== 'recovery' && !password) {
      setErrorMessage('Por favor, ingresa tu contraseña.')
      setLoading(false)
      return
    }

    try {
      if (view === 'login') {
        // Iniciar Sesión
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error

        setSuccessMessage('✓ Sesión iniciada con éxito. Redirigiendo...')
        setTimeout(() => {
          router.push('/')
          router.refresh()
        }, 1500)
      } else if (view === 'signup') {
        // Registrarse
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        })
        if (error) throw error

        setSuccessMessage('✓ Registro completado. Si se requiere confirmación de email, revisa tu bandeja de entrada.')
        setView('login')
      } else if (view === 'recovery') {
        // Recuperar Contraseña
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/update-password`
        })
        if (error) throw error

        setSuccessMessage('✓ Revisa tu correo para el enlace de recuperación.')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || 'Ocurrió un error inesperado.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      })
      if (error) throw error
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || 'Error al conectar con Google.')
      setLoading(false)
    }
  }

  const getHeaderInfo = () => {
    switch (view) {
      case 'login':
        return {
          title: '¡Bienvenido de nuevo!',
          subtitle: 'Accede para guardar y gestionar tus currículums en la nube',
        }
      case 'signup':
        return {
          title: 'Crea tu cuenta',
          subtitle: 'Comienza a crear currículums optimizados para sistemas ATS',
        }
      case 'recovery':
        return {
          title: 'Recuperar contraseña',
          subtitle: 'Te enviaremos un enlace para restablecer tu contraseña',
        }
    }
  }

  const headerInfo = getHeaderInfo()

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
      
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-sky-500/5 blur-[80px] pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-6 left-6">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Editor
        </Link>
      </div>

      <div className="w-full max-w-md bg-slate-950 rounded-2xl border border-slate-800 p-8 shadow-2xl relative z-10 space-y-6">
        
        {/* Brand logo header */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-indigo-600/30 mb-2">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {headerInfo.title}
          </h2>
          <p className="text-xs text-slate-400">
            {headerInfo.subtitle}
          </p>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-lg flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs p-3.5 rounded-lg flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Social Authentication (Google OAuth) - Only shown in login & signup views */}
        {view !== 'recovery' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-slate-100 font-bold py-3.5 rounded-xl transition duration-200 text-xs border border-slate-800 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              <span>Continuar con Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-2">
              <div className="border-t border-slate-800 w-full"></div>
              <span className="bg-slate-950 px-3 text-[10px] uppercase font-bold text-slate-500 absolute">o</span>
            </div>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@ejemplo.com"
                className="w-full bg-slate-900 text-xs text-white border border-slate-800 rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition appearance-none"
              />
            </div>
          </div>

          {view !== 'recovery' && (
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 text-xs text-white border border-slate-800 rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition appearance-none"
                />
              </div>
              
              {view === 'login' && (
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setView('recovery')
                      setErrorMessage(null)
                      setSuccessMessage(null)
                    }}
                    className="text-[11px] text-slate-400 hover:text-indigo-400 font-semibold transition cursor-pointer"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition duration-200 text-xs shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : view === 'login' ? (
              'Iniciar Sesión'
            ) : view === 'signup' ? (
              'Registrarse'
            ) : (
              'Enviar enlace de recuperación'
            )}
          </button>
        </form>

        {/* Toggle Form Buttons */}
        <div className="text-center pt-2">
          {view === 'login' && (
            <button
              onClick={() => {
                setView('signup')
                setErrorMessage(null)
                setSuccessMessage(null)
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition cursor-pointer"
            >
              ¿No tienes cuenta? Regístrate aquí
            </button>
          )}

          {view === 'signup' && (
            <button
              onClick={() => {
                setView('login')
                setErrorMessage(null)
                setSuccessMessage(null)
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition cursor-pointer"
            >
              ¿Ya tienes cuenta? Inicia sesión aquí
            </button>
          )}

          {view === 'recovery' && (
            <button
              onClick={() => {
                setView('login')
                setErrorMessage(null)
                setSuccessMessage(null)
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition cursor-pointer"
            >
              Volver a iniciar sesión
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
