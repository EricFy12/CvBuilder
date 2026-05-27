'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Cpu, 
  FolderGit, 
  Languages, 
  Printer, 
  RotateCcw, 
  Sparkles, 
  LayoutTemplate,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileDown,
  Globe,
  CheckCircle,
  Type,
  Camera,
  UploadCloud
} from 'lucide-react'
import { ResumeContent, WorkExperience, Education, Project, SkillCategory, Language } from '@/types/resume'
import { mockResumeData } from '@/utils/mockResume'
import ClassicATS from './templates/ClassicATS'
import ModernProfessional from './templates/ModernProfessional'
import HybridCompact from './templates/HybridCompact'
import HybridModern from './templates/HybridModern'
import CreativeHandout from './templates/CreativeHandout'
import { createClient } from '@/utils/supabase/client'

// Empty initial state
const emptyResumeState: ResumeContent = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
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
  languages: []
}

export default function ResumeEditor({ resumeId }: { resumeId?: string }) {
  // Resume content state
  const [resumeContent, setResumeContent] = useState<ResumeContent>(mockResumeData)
  
  // Customization settings
  const [templateId, setTemplateId] = useState<'classic' | 'modern' | 'hybrid-compact' | 'hybrid-modern' | 'creative-handout'>('modern')
  const [fontFamily, setFontFamily] = useState<'font-sans' | 'font-serif' | 'font-mono'>('font-sans')
  const [accentColor, setAccentColor] = useState<'indigo' | 'emerald' | 'sky' | 'slate'>('indigo')
  const [zoomLevel, setZoomLevel] = useState<number>(100) // percent

  // UI state: Active accordion section
  const [activeSection, setActiveSection] = useState<string>('personal')
  const [saveStatus, setSaveStatus] = useState<string>('Cambios guardados')

  // User Authentication state
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = createClient()
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        setUser(currentUser)
      } catch (err) {
        console.warn('Error al verificar sesión de Supabase:', err)
      }
    }
    checkSession()
  }, [])

  // Load from Supabase if resumeId is provided
  useEffect(() => {
    if (!resumeId) return

    const loadResumeFromSupabase = async () => {
      try {
        setSaveStatus('Cargando currículum...')
        const supabase = createClient()
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', resumeId)
          .single()

        if (error) {
          throw error
        }

        if (data) {
          if (data.content) {
            setResumeContent(data.content)
          }
          if (data.template_id) {
            setTemplateId(data.template_id as any)
          }
          setSaveStatus('✓ Currículum cargado desde la nube')
        }
      } catch (err) {
        console.error('Error al cargar currículum de Supabase:', err)
        setSaveStatus('⚠ Error al cargar desde la nube')
      }
    }

    loadResumeFromSupabase()
  }, [resumeId])

  const handleLogout = async () => {
    if (window.confirm('¿Deseas cerrar tu sesión actual?')) {
      try {
        const supabase = createClient()
        await supabase.auth.signOut()
        setUser(null)
        alert('Sesión cerrada con éxito.')
      } catch (err) {
        console.error('Error al cerrar sesión:', err)
      }
    }
  }

  // Autosave simulation or local storage sync
  useEffect(() => {
    // Only load from localstorage if we're in the default editor without a specific resumeId
    if (resumeId) return

    const saved = localStorage.getItem('ats_resume_data')
    const savedTemplate = localStorage.getItem('ats_resume_template')
    const savedFont = localStorage.getItem('ats_resume_font')
    const savedAccent = localStorage.getItem('ats_resume_accent')

    if (saved) {
      try {
        setResumeContent(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }
    if (savedTemplate) setTemplateId(savedTemplate as any)
    if (savedFont) setFontFamily(savedFont as any)
    if (savedAccent) setAccentColor(savedAccent as any)
  }, [resumeId])

  useEffect(() => {
    setSaveStatus('Guardando...')
    const timer = setTimeout(async () => {
      // Save locally as fallback
      localStorage.setItem('ats_resume_data', JSON.stringify(resumeContent))
      localStorage.setItem('ats_resume_template', templateId)
      localStorage.setItem('ats_resume_font', fontFamily)
      localStorage.setItem('ats_resume_accent', accentColor)

      // Save to Supabase if we have a specific resumeId
      if (resumeId) {
        try {
          const supabase = createClient()
          const { error } = await supabase
            .from('resumes')
            .update({
              content: resumeContent,
              template_id: templateId,
              updated_at: new Date().toISOString()
            })
            .eq('id', resumeId)

          if (error) {
            throw error
          }
          setSaveStatus('✓ Cambios guardados en la nube')
        } catch (err) {
          console.error('Error al guardar en Supabase:', err)
          setSaveStatus('⚠ Error al guardar en la nube (reintentando...)')
        }
      } else {
        setSaveStatus('✓ Cambios guardados localmente')
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [resumeContent, templateId, fontFamily, accentColor, resumeId])

  // Image Upload state and handlers
  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limit file size to 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no debe superar los 2MB.')
      return
    }

    setUploading(true)
    setUploadMessage('Subiendo imagen...')

    try {
      const supabase = createClient()
      
      // Obtener sesión del usuario autenticado
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setUploadMessage('Error: Debes iniciar sesión para subir fotos.')
        setUploading(false)
        return
      }

      // Formato requerido: ${user.id}/${file.name}
      const filePath = `${user.id}/${file.name}`

      // Subir archivo al bucket 'resume-images'
      const { data, error } = await supabase.storage
        .from('resume-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        })

      if (error) {
        throw error
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('resume-images')
        .getPublicUrl(filePath)

      handlePersonalInfoChange('imageUrl', publicUrl)
      setUploadMessage('✓ Imagen subida con éxito')
    } catch (error: any) {
      console.warn('Error en Supabase Storage, aplicando fallback local Base64:', error)
      
      // Fallback: usar una URL Base64 local temporal para que la demo funcione
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          handlePersonalInfoChange('imageUrl', event.target.result as string)
          setUploadMessage('✓ Cargada localmente (Base64)')
        }
      }
      reader.readAsDataURL(file)
    } finally {
      setUploading(false)
      setTimeout(() => setUploadMessage(null), 4000)
    }
  }

  const handleRemoveImage = () => {
    handlePersonalInfoChange('imageUrl', '')
    setUploadMessage(null)
  }

  // Handle nested Personal Info changes
  const handlePersonalInfoChange = (field: keyof ResumeContent['personalInfo'], value: string) => {
    setResumeContent(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))
  }

  // Handle simple root field changes (like summary)
  const handleRootFieldChange = (field: 'summary', value: string) => {
    setResumeContent(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Experience management helpers
  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
    setResumeContent(prev => ({
      ...prev,
      experience: [...(prev.experience || []), newExp]
    }))
  }

  const handleUpdateExperience = (id: string, field: keyof WorkExperience, value: any) => {
    setResumeContent(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }))
  }

  const handleRemoveExperience = (id: string) => {
    setResumeContent(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }))
  }

  // Education management helpers
  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      description: ''
    }
    setResumeContent(prev => ({
      ...prev,
      education: [...(prev.education || []), newEdu]
    }))
  }

  const handleUpdateEducation = (id: string, field: keyof Education, value: any) => {
    setResumeContent(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }))
  }

  const handleRemoveEducation = (id: string) => {
    setResumeContent(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }))
  }

  // Projects management helpers
  const handleAddProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      url: '',
      technologies: []
    }
    setResumeContent(prev => ({
      ...prev,
      projects: [...(prev.projects || []), newProj]
    }))
  }

  const handleUpdateProject = (id: string, field: keyof Project, value: any) => {
    setResumeContent(prev => ({
      ...prev,
      projects: (prev.projects || []).map(proj => {
        if (proj.id === id) {
          if (field === 'technologies') {
            // Split comma-separated values into array
            const arr = typeof value === 'string' ? value.split(',').map(s => s.trim()) : value
            return { ...proj, [field]: arr }
          }
          return { ...proj, [field]: value }
        }
        return proj
      })
    }))
  }

  const handleRemoveProject = (id: string) => {
    setResumeContent(prev => ({
      ...prev,
      projects: (prev.projects || []).filter(proj => proj.id !== id)
    }))
  }

  // Skills management helpers
  const handleAddSkillCategory = () => {
    const newSkillCat: SkillCategory = {
      category: '',
      items: []
    }
    setResumeContent(prev => ({
      ...prev,
      skills: [...(prev.skills || []), newSkillCat]
    }))
  }

  const handleUpdateSkillCategory = (index: number, categoryName: string, itemsString: string) => {
    const items = itemsString.split(',').map(s => s.trim()).filter(Boolean)
    setResumeContent(prev => {
      const copy = [...(prev.skills || [])]
      copy[index] = { category: categoryName, items }
      return { ...prev, skills: copy }
    })
  }

  const handleRemoveSkillCategory = (index: number) => {
    setResumeContent(prev => ({
      ...prev,
      skills: (prev.skills || []).filter((_, idx) => idx !== index)
    }))
  }

  // Languages management helpers
  const handleAddLanguage = () => {
    const newLang: Language = {
      name: '',
      level: ''
    }
    setResumeContent(prev => ({
      ...prev,
      languages: [...(prev.languages || []), newLang]
    }))
  }

  const handleUpdateLanguage = (index: number, field: keyof Language, value: string) => {
    setResumeContent(prev => {
      const copy = [...(prev.languages || [])]
      copy[index] = { ...copy[index], [field]: value }
      return { ...prev, languages: copy }
    })
  }

  const handleRemoveLanguage = (index: number) => {
    setResumeContent(prev => ({
      ...prev,
      languages: (prev.languages || []).filter((_, idx) => idx !== index)
    }))
  }

  // Remote save handler
  const handleManualSave = async () => {
    if (!resumeId) return

    setSaveStatus('Guardando en la nube...')
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('resumes')
        .update({
          content: resumeContent,
          template_id: templateId,
          updated_at: new Date().toISOString()
        })
        .eq('id', resumeId)

      if (error) {
        throw error
      }
      setSaveStatus('✓ Guardado manual exitoso')
      alert('✓ Currículum guardado correctamente en Supabase.')
    } catch (err) {
      console.error('Error al guardar currículum:', err)
      setSaveStatus('⚠ Error al guardar')
      alert('Ocurrió un error al intentar guardar en la nube.')
    }
  }

  // Reset and load mock helpers
  const handleResetData = () => {
    if (window.confirm('¿Seguro que deseas vaciar todos los campos del currículum? Se perderán los datos actuales.')) {
      setResumeContent(emptyResumeState)
    }
  }

  const handleLoadDemoData = () => {
    if (window.confirm('¿Cargar datos de demostración profesional? Esto reemplazará tu contenido actual.')) {
      setResumeContent(mockResumeData)
    }
  }

  // Print function
  const handlePrint = () => {
    window.print()
  }

  // Toggle Accordion Utility
  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? '' : section)
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 font-sans">
      
      {/* Top Navbar (Not Printed) */}
      <header className="no-print bg-slate-950 border-b border-slate-800 px-6 py-4 sticky top-0 z-50 flex flex-wrap justify-between items-center gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-2">
              ATS CV Builder
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Optimizado
              </span>
            </h1>
            <p className="text-xs text-slate-400">Currículums profesionales legibles por bots y humanos</p>
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-slate-400 font-medium hidden md:inline">
            {saveStatus}
          </span>

          {user ? (
            <>
              <span className="hidden xl:inline-block text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                Sesión: {user.email}
              </span>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 transition hover:scale-[1.02] cursor-pointer"
                title="Volver a tu panel de currículums"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-red-950/30 hover:bg-red-900 hover:text-white text-red-400 border border-red-900/30 hover:border-red-900 transition hover:scale-[1.02] cursor-pointer"
                title="Cerrar tu sesión de Supabase"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white transition hover:scale-[1.02] cursor-pointer"
              title="Iniciar sesión para guardar en la nube"
            >
              Iniciar Sesión
            </Link>
          )}

          <button
            onClick={handleLoadDemoData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-slate-700 transition hover:scale-[1.02] cursor-pointer"
            title="Cargar currículum completo de demostración"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Cargar Demo
          </button>

          <button
            onClick={handleResetData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 border border-slate-700 hover:border-red-900 transition cursor-pointer"
            title="Limpiar todos los campos"
          >
            Vaciar
          </button>

          {resumeId && (
            <button
              onClick={handleManualSave}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition hover:scale-[1.03] active:scale-95 cursor-pointer"
              title="Guardar currículum manualmente en Supabase"
            >
              <CheckCircle className="w-4 h-4" />
              Guardar Cambios
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Guardar PDF
          </button>
        </div>
      </header>

      {/* Main split viewport layout */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Panel: Form Editor (Not Printed) */}
        <section className="no-print w-full lg:w-1/2 flex flex-col border-r border-slate-800 overflow-y-auto max-h-[calc(100vh-73px)] p-6 space-y-6">
          
          {/* Visual Customization controls inside editor */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2 mb-2">
              <LayoutTemplate className="w-4 h-4 text-indigo-400" />
              Configuración de Diseño
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Template Selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Plantilla</label>
                <div className="relative">
                  <select
                    value={templateId}
                    onChange={(e: any) => setTemplateId(e.target.value)}
                    className="w-full bg-slate-900 text-xs font-bold border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 appearance-none"
                  >
                    <option value="classic">Classic ATS</option>
                    <option value="modern">Modern Professional</option>
                    <option value="hybrid-compact">Hybrid Compact</option>
                    <option value="hybrid-modern">Hybrid Modern</option>
                    <option value="creative-handout">Creative Handout (Visual)</option>
                  </select>
                  <LayoutTemplate className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Font selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Tipografía</label>
                <div className="relative">
                  <select
                    value={fontFamily}
                    onChange={(e: any) => setFontFamily(e.target.value)}
                    className="w-full bg-slate-900 text-xs font-bold border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500 appearance-none"
                  >
                    <option value="font-sans">Clean Sans-Serif</option>
                    <option value="font-serif">Classic Serif</option>
                    <option value="font-mono">Tech Monospace</option>
                  </select>
                  <Type className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Accent Color selection (For Modern and Hybrid-Compact Templates) */}
              <div>
                <label className={`block text-[11px] font-bold text-slate-400 uppercase mb-1.5 transition ${templateId !== 'classic' ? 'opacity-100' : 'opacity-40'}`}>
                  Color Acento
                </label>
                <div className="flex gap-2 items-center h-8">
                  {['indigo', 'emerald', 'sky', 'slate'].map((color) => {
                    const colors: Record<string, string> = {
                      indigo: 'bg-indigo-500 border-indigo-300',
                      emerald: 'bg-emerald-500 border-emerald-300',
                      sky: 'bg-sky-500 border-sky-300',
                      slate: 'bg-slate-600 border-slate-400'
                    }
                    return (
                      <button
                        key={color}
                        disabled={templateId === 'classic'}
                        onClick={() => setAccentColor(color as any)}
                        className={`w-6 h-6 rounded-full border-2 transition ${colors[color]} ${accentColor === color && templateId !== 'classic' ? 'scale-125 border-white ring-2 ring-indigo-500/20' : 'opacity-70 hover:opacity-100 disabled:opacity-20 disabled:scale-100'}`}
                        title={`Color ${color}`}
                      />
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Tamaño de Letra Toggle */}
            <div className="pt-3 flex justify-between items-center text-xs border-t border-slate-800">
              <div className="space-y-0.5">
                <span className="text-slate-200 font-bold block">Tamaño de Letra</span>
                <span className="text-[10px] text-slate-400 block">Ajusta el tamaño general del texto del currículum</span>
              </div>
              <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setResumeContent(prev => ({ ...prev, fontSize: 'sm' }))}
                  className={`px-2 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${(resumeContent.fontSize === 'sm') ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Pequeña
                </button>
                <button
                  type="button"
                  onClick={() => setResumeContent(prev => ({ ...prev, fontSize: 'md' }))}
                  className={`px-2 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${(!resumeContent.fontSize || resumeContent.fontSize === 'md') ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Mediana
                </button>
                <button
                  type="button"
                  onClick={() => setResumeContent(prev => ({ ...prev, fontSize: 'lg' }))}
                  className={`px-2 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${(resumeContent.fontSize === 'lg') ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Grande
                </button>
              </div>
            </div>

            {/* Foto Avatar Position Toggle */}
            <div className="pt-3 flex justify-between items-center text-xs border-t border-slate-800">
              <div className="space-y-0.5">
                <span className="text-slate-200 font-bold block">Posición de Foto (Hybrid Modern)</span>
                <span className="text-[10px] text-slate-400 block">Ubica tu imagen arriba o a un lado del nombre</span>
              </div>
              <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setResumeContent(prev => ({ ...prev, avatarPosition: 'side' }))}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${(!resumeContent.avatarPosition || resumeContent.avatarPosition === 'side') ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Al Lado
                </button>
                <button
                  type="button"
                  onClick={() => setResumeContent(prev => ({ ...prev, avatarPosition: 'top' }))}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${(resumeContent.avatarPosition === 'top') ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                  Arriba
                </button>
              </div>
            </div>

            {/* Diseño Compacto Switch */}
            <div className="pt-3 flex justify-between items-center text-xs border-t border-slate-800">
              <div className="space-y-0.5">
                <span className="text-slate-200 font-bold block">Forzar a 1 página (Diseño Compacto)</span>
                <span className="text-[10px] text-slate-400 block">Reduce espacios y fuentes para encajar todo en una página</span>
              </div>
              <button
                type="button"
                onClick={() => setResumeContent(prev => ({ ...prev, isCompact: !prev.isCompact }))}
                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${resumeContent.isCompact ? 'bg-indigo-600' : 'bg-slate-800'}`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${resumeContent.isCompact ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>

            {/* Zoom control */}
            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-semibold">Tamaño Vista Previa:</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="60"
                  max="120"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(Number(e.target.value))}
                  className="w-28 accent-indigo-500 bg-slate-800"
                />
                <span className="font-bold text-slate-200 w-8 text-right">{zoomLevel}%</span>
              </div>
            </div>
          </div>

          {/* Form Accordion Group */}
          <div className="space-y-4">
            
            {/* Section: Order Sections */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection('sectionOrder')}
                className="w-full flex items-center justify-between px-5 py-4 font-bold text-left hover:bg-slate-900/50 transition text-white"
              >
                <div className="flex items-center gap-3">
                  <LayoutTemplate className="w-5 h-5 text-indigo-400" />
                  <span>Ordenar Secciones del CV</span>
                </div>
                {activeSection === 'sectionOrder' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {activeSection === 'sectionOrder' && (
                <div className="p-5 border-t border-slate-900 bg-slate-950/40 space-y-3">
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Usa las flechas para reordenar las secciones principales en tu currículum. La información personal y el resumen profesional siempre permanecerán fijos arriba.
                  </p>
                  
                  <div className="space-y-2">
                    {(() => {
                      const defaultOrder = ['work', 'education', 'skills', 'projects', 'languages']
                      const currentOrder = resumeContent.sectionOrder || defaultOrder
                      
                      const sectionNames: Record<string, string> = {
                        work: 'Trayectoria Profesional',
                        education: 'Educación y Formación',
                        skills: 'Habilidades Técnicas',
                        projects: 'Proyectos Destacados',
                        languages: 'Idiomas'
                      }

                      const handleMoveSection = (index: number, direction: 'up' | 'down') => {
                        const newOrder = [...currentOrder]
                        const targetIndex = direction === 'up' ? index - 1 : index + 1
                        
                        if (targetIndex < 0 || targetIndex >= newOrder.length) return
                        
                        // Swap elements
                        const temp = newOrder[index]
                        newOrder[index] = newOrder[targetIndex]
                        newOrder[targetIndex] = temp
                        
                        setResumeContent(prev => ({
                          ...prev,
                          sectionOrder: newOrder
                        }))
                      }

                      return currentOrder.map((secKey, idx) => (
                        <div 
                          key={secKey}
                          className="flex items-center justify-between bg-slate-900 px-4 py-3 rounded-lg border border-slate-800 transition hover:border-slate-700"
                        >
                          <span className="text-xs font-bold text-white">
                            {sectionNames[secKey] || secKey}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleMoveSection(idx, 'up')}
                              disabled={idx === 0}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-indigo-400 text-xs font-black rounded border border-slate-700 transition cursor-pointer"
                              title="Subir sección"
                            >
                              ▲
                            </button>
                            <button
                              onClick={() => handleMoveSection(idx, 'down')}
                              disabled={idx === currentOrder.length - 1}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-indigo-400 text-xs font-black rounded border border-slate-700 transition cursor-pointer"
                              title="Bajar sección"
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                      ))
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Section: Personal Info */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection('personal')}
                className="w-full flex items-center justify-between px-5 py-4 font-bold text-left hover:bg-slate-900/50 transition text-white"
              >
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-indigo-400" />
                  <span>Datos Personales</span>
                </div>
                {activeSection === 'personal' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {activeSection === 'personal' && (
                <div className="p-5 border-t border-slate-900 bg-slate-950/40 grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Carga de Imagen de Perfil */}
                  <div className="md:col-span-2 flex flex-col sm:flex-row items-center gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div className="relative group w-20 h-20 rounded-full bg-slate-850 border-2 border-slate-700 flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-indigo-500 shadow-md flex-shrink-0">
                      {resumeContent.personalInfo.imageUrl ? (
                        <img 
                          src={resumeContent.personalInfo.imageUrl} 
                          alt="Foto de perfil" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="w-6 h-6 text-slate-500 group-hover:text-indigo-400 transition" />
                      )}
                      
                      {/* Hover Overlay */}
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-[9px] font-bold text-white cursor-pointer transition duration-300">
                        <UploadCloud className="w-4 h-4 mb-0.5 text-indigo-300 animate-pulse" />
                        <span>Subir</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                      </label>
                    </div>

                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <h4 className="text-xs font-bold text-white">Foto de Perfil</h4>
                      <p className="text-[10px] text-slate-400 leading-snug">
                        Sube una foto profesional en formato JPG, PNG o WebP (Max. 2MB).
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start pt-1">
                        <label className={`px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold cursor-pointer transition shadow-sm ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                          {uploading ? 'Subiendo...' : 'Seleccionar archivo'}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                        
                        {resumeContent.personalInfo.imageUrl && (
                          <button
                            onClick={handleRemoveImage}
                            className="px-3 py-1 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-900 rounded text-[10px] font-bold transition"
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                      
                      {uploadMessage && (
                        <p className={`text-[10px] font-semibold mt-1 transition ${uploadMessage.includes('✓') ? 'text-emerald-400' : 'text-indigo-400'}`}>
                          {uploadMessage}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Nombre Completo</label>
                    <input
                      type="text"
                      value={resumeContent.personalInfo.fullName}
                      onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                      placeholder="Ej. Juan Pérez García"
                      className="w-full bg-slate-900 text-xs text-white border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Título Profesional</label>
                    <input
                      type="text"
                      value={resumeContent.personalInfo.title}
                      onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
                      placeholder="Ej. Ingeniero de Software / Arquitecto Cloud"
                      className="w-full bg-slate-900 text-xs text-white border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Email</label>
                    <input
                      type="email"
                      value={resumeContent.personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      placeholder="ejemplo@email.com"
                      className="w-full bg-slate-900 text-xs text-white border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={resumeContent.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      placeholder="+34 600 000 000"
                      className="w-full bg-slate-900 text-xs text-white border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Ubicación</label>
                    <input
                      type="text"
                      value={resumeContent.personalInfo.location}
                      onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                      placeholder="Ej. Madrid, España"
                      className="w-full bg-slate-900 text-xs text-white border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Sitio Web Personal</label>
                    <div className="relative">
                      <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={resumeContent.personalInfo.website || ''}
                        onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                        placeholder="https://miweb.dev"
                        className="w-full bg-slate-900 text-xs text-white border border-slate-800 rounded-lg pl-9 pr-2.5 py-2.5 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">LinkedIn (sin https://)</label>
                    <div className="relative">
                      <svg className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                      <input
                        type="text"
                        value={resumeContent.personalInfo.linkedin || ''}
                        onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                        placeholder="linkedin.com/in/usuario"
                        className="w-full bg-slate-900 text-xs text-white border border-slate-800 rounded-lg pl-9 pr-2.5 py-2.5 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">GitHub (sin https://)</label>
                    <div className="relative">
                      <svg className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                      <input
                        type="text"
                        value={resumeContent.personalInfo.github || ''}
                        onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                        placeholder="github.com/usuario"
                        className="w-full bg-slate-900 text-xs text-white border border-slate-800 rounded-lg pl-9 pr-2.5 py-2.5 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section: Professional Summary */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection('summary')}
                className="w-full flex items-center justify-between px-5 py-4 font-bold text-left hover:bg-slate-900/50 transition text-white"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <span>Resumen Profesional</span>
                </div>
                {activeSection === 'summary' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {activeSection === 'summary' && (
                <div className="p-5 border-t border-slate-900 bg-slate-950/40">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Resumen del perfil</label>
                  <textarea
                    rows={4}
                    value={resumeContent.summary}
                    onChange={(e) => handleRootFieldChange('summary', e.target.value)}
                    placeholder="Escribe un resumen ejecutivo breve y conciso de 3 a 5 líneas enfocado en tu experiencia, tus mayores logros y tecnologías core..."
                    className="w-full bg-slate-900 text-xs text-white border border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500 resize-y"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">💡 Consejo ATS: Los sistemas automáticos leen esta sección buscando keywords técnicas esenciales de la vacante.</p>
                </div>
              )}
            </div>

            {/* Section: Experience */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection('experience')}
                className="w-full flex items-center justify-between px-5 py-4 font-bold text-left hover:bg-slate-900/50 transition text-white"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  <span>Trayectoria Profesional ({resumeContent.experience?.length || 0})</span>
                </div>
                {activeSection === 'experience' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {activeSection === 'experience' && (
                <div className="p-5 border-t border-slate-900 bg-slate-950/40 space-y-4">
                  
                  {resumeContent.experience?.map((exp, idx) => (
                    <div key={exp.id} className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3 relative group">
                      <button
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition"
                        title="Eliminar puesto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <h4 className="text-xs font-bold text-indigo-400">Puesto #{idx + 1}</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Empresa</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                            placeholder="Ej. Tech Solutions"
                            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Cargo / Rol</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => handleUpdateExperience(exp.id, 'role', e.target.value)}
                            placeholder="Ej. Ingeniero Senior"
                            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Fecha Inicio (AAAA-MM)</label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
                            placeholder="Ej. 2022-01"
                            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Fecha Fin / 'Presente'</label>
                          <input
                            type="text"
                            disabled={exp.current}
                            value={exp.current ? 'Presente' : exp.endDate}
                            onChange={(e) => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
                            placeholder="Ej. 2024-05"
                            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                          />
                        </div>
                        <div className="sm:col-span-2 flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`curr-${exp.id}`}
                            checked={exp.current}
                            onChange={(e) => {
                              handleUpdateExperience(exp.id, 'current', e.target.checked)
                              if (e.target.checked) {
                                handleUpdateExperience(exp.id, 'endDate', 'Presente')
                              }
                            }}
                            className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-0"
                          />
                          <label htmlFor={`curr-${exp.id}`} className="text-[11px] font-semibold text-slate-300">
                            Trabajo actualmente en este puesto
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Logros y Descripción</label>
                        <textarea
                          rows={4}
                          value={exp.description}
                          onChange={(e) => handleUpdateExperience(exp.id, 'description', e.target.value)}
                          placeholder="Usa viñetas para listar tus logros con impacto medible:\n• Rediseñé la interfaz del checkout reduciendo el abandono de carrito en 15%.\n• Lideré la migración a Next.js mejorando el SEO..."
                          className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500 resize-y"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleAddExperience}
                    className="w-full py-2.5 rounded-lg border-2 border-dashed border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/20 text-slate-400 hover:text-indigo-400 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Añadir Puesto de Trabajo
                  </button>

                </div>
              )}
            </div>

            {/* Section: Education */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection('education')}
                className="w-full flex items-center justify-between px-5 py-4 font-bold text-left hover:bg-slate-900/50 transition text-white"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                  <span>Educación ({resumeContent.education?.length || 0})</span>
                </div>
                {activeSection === 'education' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {activeSection === 'education' && (
                <div className="p-5 border-t border-slate-900 bg-slate-950/40 space-y-4">
                  
                  {resumeContent.education?.map((edu, idx) => (
                    <div key={edu.id} className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3 relative group">
                      <button
                        onClick={() => handleRemoveEducation(edu.id)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition"
                        title="Eliminar educación"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <h4 className="text-xs font-bold text-indigo-400">Estudios #{idx + 1}</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Institución Educativa</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                            placeholder="Ej. Universidad Complutense de Madrid"
                            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Título / Certificación</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                            placeholder="Ej. Grado Universitario / Bootcamp"
                            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Área de Estudio</label>
                          <input
                            type="text"
                            value={edu.fieldOfStudy}
                            onChange={(e) => handleUpdateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                            placeholder="Ej. Ingeniería Informática"
                            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Año Inicio (AAAA)</label>
                          <input
                            type="text"
                            value={edu.startDate}
                            onChange={(e) => handleUpdateEducation(edu.id, 'startDate', e.target.value)}
                            placeholder="Ej. 2018"
                            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Año Fin (o 'Presente')</label>
                          <input
                            type="text"
                            value={edu.endDate}
                            onChange={(e) => handleUpdateEducation(edu.id, 'endDate', e.target.value)}
                            placeholder="Ej. 2022"
                            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Detalles Adicionales (Opcional)</label>
                        <input
                          type="text"
                          value={edu.description || ''}
                          onChange={(e) => handleUpdateEducation(edu.id, 'description', e.target.value)}
                          placeholder="Ej. Matrícula de honor, especialidad en software..."
                          className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleAddEducation}
                    className="w-full py-2.5 rounded-lg border-2 border-dashed border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/20 text-slate-400 hover:text-indigo-400 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Añadir Formación
                  </button>

                </div>
              )}
            </div>

            {/* Section: Projects */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection('projects')}
                className="w-full flex items-center justify-between px-5 py-4 font-bold text-left hover:bg-slate-900/50 transition text-white"
              >
                <div className="flex items-center gap-3">
                  <FolderGit className="w-5 h-5 text-indigo-400" />
                  <span>Proyectos Destacados ({resumeContent.projects?.length || 0})</span>
                </div>
                {activeSection === 'projects' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {activeSection === 'projects' && (
                <div className="p-5 border-t border-slate-900 bg-slate-950/40 space-y-4">
                  
                  {resumeContent.projects?.map((proj, idx) => (
                    <div key={proj.id} className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3 relative group">
                      <button
                        onClick={() => handleRemoveProject(proj.id)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition"
                        title="Eliminar proyecto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <h4 className="text-xs font-bold text-indigo-400">Proyecto #{idx + 1}</h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Nombre del Proyecto</label>
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => handleUpdateProject(proj.id, 'name', e.target.value)}
                            placeholder="Ej. Shop App"
                            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Enlace del Proyecto</label>
                          <input
                            type="text"
                            value={proj.url || ''}
                            onChange={(e) => handleUpdateProject(proj.id, 'url', e.target.value)}
                            placeholder="Ej. github.com/user/repo"
                            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Tecnologías (separadas por comas)</label>
                          <input
                            type="text"
                            value={proj.technologies?.join(', ') || ''}
                            onChange={(e) => handleUpdateProject(proj.id, 'technologies', e.target.value)}
                            placeholder="Ej. Next.js, Stripe, PostgreSQL"
                            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Breve Descripción</label>
                        <textarea
                          rows={3}
                          value={proj.description}
                          onChange={(e) => handleUpdateProject(proj.id, 'description', e.target.value)}
                          placeholder="Describe el propósito del proyecto, tu rol y el impacto logrado..."
                          className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500 resize-y"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleAddProject}
                    className="w-full py-2.5 rounded-lg border-2 border-dashed border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/20 text-slate-400 hover:text-indigo-400 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Añadir Proyecto
                  </button>

                </div>
              )}
            </div>

            {/* Section: Skills */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection('skills')}
                className="w-full flex items-center justify-between px-5 py-4 font-bold text-left hover:bg-slate-900/50 transition text-white"
              >
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <span>Habilidades Técnicas ({resumeContent.skills?.length || 0})</span>
                </div>
                {activeSection === 'skills' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {activeSection === 'skills' && (
                <div className="p-5 border-t border-slate-900 bg-slate-950/40 space-y-4">
                  
                  {/* Skills Display Mode Selector */}
                  <div className="flex justify-between items-center text-xs bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-300 font-semibold">Formato de Habilidades:</span>
                    <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setResumeContent(prev => ({ ...prev, skillsDisplayMode: 'tags' }))}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${(!resumeContent.skillsDisplayMode || resumeContent.skillsDisplayMode === 'tags') ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                      >
                        Bloques (Tags)
                      </button>
                      <button
                        type="button"
                        onClick={() => setResumeContent(prev => ({ ...prev, skillsDisplayMode: 'inline' }))}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${(resumeContent.skillsDisplayMode === 'inline') ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                      >
                        En Línea ( • )
                      </button>
                    </div>
                  </div>

                  {resumeContent.skills?.map((skillCat, idx) => (
                    <div key={idx} className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3 relative group">
                      <button
                        onClick={() => handleRemoveSkillCategory(idx)}
                        className="absolute top-4 right-4 text-slate-500 hover:text-red-400 transition"
                        title="Eliminar categoría"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Nombre de Categoría</label>
                          <input
                            type="text"
                            value={skillCat.category}
                            onChange={(e) => handleUpdateSkillCategory(idx, e.target.value, skillCat.items.join(', '))}
                            placeholder="Ej. Lenguajes de Programación, Herramientas, etc."
                            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Elementos (separados por comas)</label>
                          <input
                            type="text"
                            value={skillCat.items.join(', ')}
                            onChange={(e) => handleUpdateSkillCategory(idx, skillCat.category, e.target.value)}
                            placeholder="Ej. React, Next.js, TypeScript, Node.js"
                            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={handleAddSkillCategory}
                    className="w-full py-2.5 rounded-lg border-2 border-dashed border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/20 text-slate-400 hover:text-indigo-400 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Añadir Categoría de Habilidades
                  </button>

                </div>
              )}
            </div>

            {/* Section: Languages */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection('languages')}
                className="w-full flex items-center justify-between px-5 py-4 font-bold text-left hover:bg-slate-900/50 transition text-white"
              >
                <div className="flex items-center gap-3">
                  <Languages className="w-5 h-5 text-indigo-400" />
                  <span>Idiomas ({resumeContent.languages?.length || 0})</span>
                </div>
                {activeSection === 'languages' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {activeSection === 'languages' && (
                <div className="p-5 border-t border-slate-900 bg-slate-950/40 space-y-4">
                  
                  {resumeContent.languages?.map((lang, idx) => (
                    <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-center gap-3 relative group">
                      
                      <div className="flex-1 grid grid-cols-2 gap-3 pr-8">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Idioma</label>
                          <input
                            type="text"
                            value={lang.name}
                            onChange={(e) => handleUpdateLanguage(idx, 'name', e.target.value)}
                            placeholder="Ej. Inglés"
                            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Nivel</label>
                          <input
                            type="text"
                            value={lang.level}
                            onChange={(e) => handleUpdateLanguage(idx, 'level', e.target.value)}
                            placeholder="Ej. C1 / Nativo / Intermedio"
                            className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded-lg p-2 focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveLanguage(idx)}
                        className="text-slate-500 hover:text-red-400 transition absolute right-3"
                        title="Eliminar idioma"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={handleAddLanguage}
                    className="w-full py-2.5 rounded-lg border-2 border-dashed border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900/20 text-slate-400 hover:text-indigo-400 font-semibold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Añadir Idioma
                  </button>

                </div>
              )}
            </div>

          </div>

          {/* Footer Info */}
          <footer className="pt-6 text-center text-[10px] text-slate-500 border-t border-slate-800/40 space-y-1">
            <p>ATS CV Builder — Construido con Next.js, Supabase y Tailwind CSS.</p>
            <p className="text-slate-600">Exporta a PDF de alta resolución nativo sin pérdida de legibilidad de texto.</p>
          </footer>

        </section>

        {/* Right Panel: Live A4 PDF Preview Page */}
        <section className="w-full lg:w-1/2 bg-slate-850 overflow-y-auto max-h-[calc(100vh-73px)] p-6 lg:p-10 flex justify-center items-start print:max-h-none print:p-0 print:bg-white print:w-full">
          
          {/* Mock A4 Page container */}
          <div 
            id="ats-resume-print-area"
            style={{ 
              transform: `scale(${zoomLevel / 100})`, 
              transformOrigin: 'top center' 
            }}
            className="w-[210mm] min-h-[297mm] bg-white shadow-2xl rounded-sm border border-slate-200 text-black overflow-hidden print-full-width transition-transform duration-100 ease-out print:shadow-none print:border-none print:transform-none print-container"
          >
            {templateId === 'classic' ? (
              <ClassicATS content={resumeContent} fontClass={fontFamily} />
            ) : templateId === 'hybrid-compact' ? (
              <HybridCompact 
                content={resumeContent} 
                fontClass={fontFamily}
                accentColor={accentColor}
              />
            ) : templateId === 'hybrid-modern' ? (
              <HybridModern 
                content={resumeContent} 
                fontClass={fontFamily}
                accentColor={accentColor}
              />
            ) : templateId === 'creative-handout' ? (
              <CreativeHandout 
                content={resumeContent} 
                fontClass={fontFamily}
                accentColor={accentColor}
              />
            ) : (
              <ModernProfessional 
                content={resumeContent} 
                fontClass={fontFamily}
                accentColor={accentColor}
              />
            )}
          </div>

        </section>
        
      </main>

    </div>
  )
}
