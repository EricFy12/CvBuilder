'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Sparkles, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
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

    if (!email || !password) {
      setErrorMessage('Por favor, rellena todos los campos.')
      setLoading(false)
      return
    }

    try {
      if (isLogin) {
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
      } else {
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
        setIsLogin(true)
      }
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message || 'Ocurrió un error inesperado.')
    } finally {
      setLoading(false)
    }
  }

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
            {isLogin ? '¡Bienvenido de nuevo!' : 'Crea tu cuenta'}
          </h2>
          <p className="text-xs text-slate-400">
            {isLogin ? 'Accede para guardar y gestionar tus currículums en la nube' : 'Comienza a crear currículums optimizados para sistemas ATS'}
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition duration-255 text-xs shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isLogin ? (
              'Iniciar Sesión'
            ) : (
              'Registrarse'
            )}
          </button>
        </form>

        {/* Toggle Form Buttons */}
        <div className="text-center pt-2">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setErrorMessage(null)
              setSuccessMessage(null)
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión aquí'}
          </button>
        </div>

      </div>
    </div>
  )
}
