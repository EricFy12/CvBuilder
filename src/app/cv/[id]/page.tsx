'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import ClassicATS from '@/components/templates/ClassicATS'
import ModernProfessional from '@/components/templates/ModernProfessional'
import HybridCompact from '@/components/templates/HybridCompact'
import HybridModern from '@/components/templates/HybridModern'
import CreativeHandout from '@/components/templates/CreativeHandout'
import { FileDown, Sparkles, Loader2 } from 'lucide-react'

export default function PublicCvPage() {
  const params = useParams()
  const id = params?.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resumeData, setResumeData] = useState<any>(null)

  useEffect(() => {
    if (!id) return

    const fetchCV = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          throw error
        }

        if (data) {
          setResumeData(data)
        } else {
          setError('El currículum no existe o no es público.')
        }
      } catch (err: any) {
        console.error('Error al cargar currículum público:', err)
        setError(err.message || 'Error al conectar con la base de datos.')
      } finally {
        setLoading(false)
      }
    }

    fetchCV()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Cargando currículum...</p>
      </div>
    )
  }

  if (error || !resumeData) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl max-w-md">
          <p className="text-sm font-bold">Error al cargar currículum</p>
          <p className="text-xs text-slate-400 mt-1">{error || 'El recurso solicitado no fue encontrado.'}</p>
        </div>
      </div>
    )
  }

  const { content: resumeContent, template_id: templateId, font_family: fontFamily, accent_color: accentColor } = resumeData
  
  const activeTemplate = templateId || 'modern'
  const activeFont = fontFamily || 'font-sans'
  const activeAccent = accentColor || 'indigo'

  const handlePrint = () => {
    window.print()
  }

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans print:bg-white print:min-h-0 print:h-auto">
      
      {/* Top Floating Web-Only Bar */}
      <header className="no-print print:hidden bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 sticky top-0 z-50 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-300">CV Builder — Vista Pública</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            Descargar PDF
          </button>
          
          <span className="text-[10px] text-slate-500 font-semibold border-l border-slate-800 pl-3">
            Creado con CV Builder
          </span>
        </div>
      </header>

      {/* CV Render Area */}
      <div className="flex-1 overflow-y-auto p-6 lg:p-10 flex justify-center items-start print:p-0 print:bg-white print:w-full print:overflow-visible">
        <div 
          id="ats-resume-print-area"
          className="w-[210mm] min-h-[297mm] bg-white shadow-2xl rounded-sm border border-slate-200 text-black overflow-hidden print-full-width print:shadow-none print:border-none print-container print:overflow-visible"
        >
          {activeTemplate === 'classic' ? (
            <ClassicATS content={resumeContent} fontClass={activeFont} />
          ) : activeTemplate === 'hybrid-compact' ? (
            <HybridCompact 
              content={resumeContent} 
              fontClass={activeFont}
              accentColor={activeAccent}
            />
          ) : activeTemplate === 'hybrid-modern' ? (
            <HybridModern 
              content={resumeContent} 
              fontClass={activeFont}
              accentColor={activeAccent}
            />
          ) : activeTemplate === 'creative-handout' ? (
            <CreativeHandout 
              content={resumeContent} 
              fontClass={activeFont}
              accentColor={activeAccent}
            />
          ) : (
            <ModernProfessional 
              content={resumeContent} 
              fontClass={activeFont}
              accentColor={activeAccent}
            />
          )}
        </div>
      </div>

    </main>
  )
}
