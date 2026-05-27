'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Layout, 
  LogOut, 
  ArrowLeft, 
  AlertCircle, 
  FolderOpen,
  User,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface ResumeListItem {
  id: string
  title: string
  updated_at: string
  template_id: string
}

export default function DashboardPage() {
  const [resumes, setResumes] = useState<ResumeListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const router = useRouter()
  const supabase = createClient()

  // Authenticate user and fetch resumes
  useEffect(() => {
    const initDashboard = async () => {
      try {
        setLoading(true)
        const { data: { user: currentUser } } = await supabase.auth.getUser()

        if (!currentUser) {
          // If not logged in, redirect to auth page
          router.push('/auth')
          return
        }

        setUser(currentUser)
        await fetchResumes(currentUser.id)
      } catch (err: any) {
        console.error('Error al inicializar el panel:', err)
        setErrorMessage('No se pudo verificar la sesión. Inténtalo de nuevo.')
      } finally {
        setLoading(false)
      }
    }

    initDashboard()
  }, [router])

  // Fetch resumes from Supabase
  const fetchResumes = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('id, title, updated_at, template_id')
        .order('updated_at', { ascending: false })

      if (error) {
        throw error
      }

      setResumes(data || [])
    } catch (err: any) {
      console.error('Error al cargar currículums:', err)
      setErrorMessage('Ocurrió un error al cargar la lista de currículums.')
    }
  }

  // Create a new resume
  const handleCreateResume = async () => {
    if (!user) return

    setActionLoading('create')
    setErrorMessage(null)

    try {
      // Default empty resume structure matching standard format
      const defaultContent = {
        personalInfo: {
          fullName: '',
          title: '',
          email: user.email || '',
          phone: '',
          location: '',
          website: '',
          linkedin: '',
          github: ''
        },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        languages: [],
        sectionOrder: ['work', 'education', 'skills', 'projects', 'languages'],
        isCompact: false
      }

      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          title: 'Mi Currículum Profesional',
          content: defaultContent,
          template_id: 'modern'
        })
        .select('id')
        .single()

      if (error) {
        throw error
      }

      if (data?.id) {
        // Redirect to editor dynamic page with the new resume ID
        router.push(`/editor/${data.id}`)
      }
    } catch (err: any) {
      console.error('Error al crear currículum:', err)
      setErrorMessage('No se pudo crear un nuevo currículum. Inténtalo de nuevo.')
    } finally {
      setActionLoading(null)
    }
  }

  // Delete a resume
  const handleDeleteResume = async (id: string, title: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente el currículum "${title}"?`)) {
      return
    }

    setActionLoading(id)
    setErrorMessage(null)

    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)

      if (error) {
        throw error
      }

      // Update local state list
      setResumes(prev => prev.filter(resume => resume.id !== id))
    } catch (err: any) {
      console.error('Error al eliminar currículum:', err)
      setErrorMessage('No se pudo eliminar el currículum seleccionado.')
    } finally {
      setActionLoading(null)
    }
  }

  // Sign out user
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth')
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  // Helper to format date nicely
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    } catch (e) {
      return dateString
    }
  }

  // Helper to map template_id to friendly name
  const getTemplateName = (templateId: string) => {
    const templates: Record<string, string> = {
      classic: 'Classic ATS',
      modern: 'Modern Professional',
      'hybrid-compact': 'Hybrid Compact',
      'hybrid-modern': 'Hybrid Modern',
      'creative-handout': 'Creative Handout'
    }
    return templates[templateId] || templateId
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans relative overflow-x-hidden">
      
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[300px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[400px] h-[400px] rounded-full bg-sky-500/5 blur-[100px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="bg-slate-950/80 border-b border-slate-800/80 px-6 py-4 sticky top-0 z-40 backdrop-blur-md flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-white tracking-tight flex items-center gap-2">
              ATS CV Dashboard
              <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                Mis CVs
              </span>
            </h1>
            <p className="text-xs text-slate-400">Gestiona y crea tus currículums profesionales en la nube</p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-300 bg-slate-800/40 border border-slate-800 px-3 py-1.5 rounded-lg">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>{user.email}</span>
            </div>
          )}

          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Editor Base
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/20 hover:bg-red-900 hover:text-white text-red-400 border border-red-900/30 transition cursor-pointer"
            title="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8 relative z-10">
        
        {/* Welcome Section / Create New Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800/60">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Mis Currículums</h2>
            <p className="text-xs text-slate-400 mt-1">Crea nuevas versiones adaptadas a diferentes puestos de trabajo</p>
          </div>

          <button
            onClick={handleCreateResume}
            disabled={actionLoading === 'create' || loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {actionLoading === 'create' ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Crear Nuevo Currículum
          </button>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold">Error:</span> {errorMessage}
            </div>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="text-red-400 hover:text-red-200 text-xs font-bold"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Main Grid View */}
        {loading ? (
          // Shimmer Skeleton Loader
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 space-y-4 animate-pulse">
                <div className="h-4 bg-slate-800 rounded w-2/3" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-850 rounded w-1/2" />
                  <div className="h-3 bg-slate-850 rounded w-3/4" />
                </div>
                <div className="pt-4 flex justify-between gap-4 border-t border-slate-800/40">
                  <div className="h-8 bg-slate-800 rounded w-1/3" />
                  <div className="h-8 bg-slate-800 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          // Empty State
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-6 shadow-inner">
            <div className="inline-flex bg-slate-900 p-4 rounded-2xl border border-slate-800 text-slate-500">
              <FolderOpen className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">No tienes currículums guardados</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Aún no has creado ningún currículum guardado en la nube. Haz clic en el botón para crear tu primer currículum optimizado.
              </p>
            </div>
            <button
              onClick={handleCreateResume}
              disabled={actionLoading === 'create'}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Crear tu primer CV
            </button>
          </div>
        ) : (
          // Active List Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div 
                key={resume.id}
                className="group bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-indigo-500/5 transition duration-250 flex flex-col justify-between space-y-5"
              >
                {/* CV Card Header details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-white text-sm group-hover:text-indigo-400 transition leading-snug line-clamp-2">
                      {resume.title}
                    </h3>
                  </div>

                  {/* Badges / Stats */}
                  <div className="flex flex-col gap-2 pt-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Layout className="w-3.5 h-3.5 text-indigo-500/80" />
                      <span className="font-medium text-slate-300">
                        Plantilla: <strong className="text-indigo-400">{getTemplateName(resume.template_id)}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-indigo-500/80" />
                      <span className="font-medium text-slate-300">
                        Modificado: <span className="text-slate-400">{formatDate(resume.updated_at)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800/40">
                  <Link
                    href={`/editor/${resume.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-indigo-950/40 hover:bg-indigo-600 border border-indigo-900/60 hover:border-indigo-500 text-indigo-300 hover:text-white transition duration-200 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Editar
                  </Link>

                  <button
                    onClick={() => handleDeleteResume(resume.id, resume.title)}
                    disabled={actionLoading === resume.id}
                    className="flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-950/40 transition duration-200 cursor-pointer"
                    title="Eliminar currículum"
                  >
                    {actionLoading === resume.id ? (
                      <span className="w-3.5 h-3.5 border-2 border-slate-500/30 border-t-red-500 rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
