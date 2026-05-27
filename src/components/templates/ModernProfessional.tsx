import React from 'react'
import { ResumeContent } from '@/types/resume'

interface ModernProfessionalProps {
  content: ResumeContent
  fontClass?: string
  accentColor?: string // e.g. "indigo", "emerald", "sky", "slate"
}

export default function ModernProfessional({ 
  content, 
  fontClass = 'font-sans',
  accentColor = 'indigo'
}: ModernProfessionalProps) {
  const { personalInfo, summary, experience, education, skills, projects, languages } = content

  // Accent styles map
  const accents: Record<string, { bg: string, text: string, border: string, textMuted: string }> = {
    indigo: {
      bg: 'bg-indigo-600',
      text: 'text-indigo-600',
      border: 'border-indigo-600',
      textMuted: 'text-indigo-800'
    },
    emerald: {
      bg: 'bg-emerald-600',
      text: 'text-emerald-600',
      border: 'border-emerald-600',
      textMuted: 'text-emerald-800'
    },
    sky: {
      bg: 'bg-sky-600',
      text: 'text-sky-600',
      border: 'border-sky-600',
      textMuted: 'text-sky-800'
    },
    slate: {
      bg: 'bg-slate-800',
      text: 'text-slate-800',
      border: 'border-slate-800',
      textMuted: 'text-slate-900'
    }
  }

  const activeAccent = accents[accentColor] || accents.indigo

  // Render modular blocks
  const renderSummary = () => {
    if (!summary) return null
    return (
      <section className="">
        <h2 
          className={`text-[12.5px] font-bold uppercase tracking-wider border-b-2 ${activeAccent.border} pb-1 mb-2.5 text-slate-900`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Perfil Profesional
        </h2>
        <p className="text-slate-700 text-justify whitespace-pre-line leading-relaxed print-avoid-break break-inside-avoid">
          {summary}
        </p>
      </section>
    )
  }

  const renderExperience = () => {
    if (!experience || experience.length === 0) return null
    return (
      <section className="">
        <h2 
          className={`text-[12.5px] font-bold uppercase tracking-wider border-b-2 ${activeAccent.border} pb-1 mb-3 text-slate-900`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Trayectoria Profesional
        </h2>
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="print-avoid-break break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-slate-900 text-[12px]">
                <span>{exp.company}</span>
                <span className="font-semibold text-slate-500 text-[10.5px]">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <div className={`text-[11px] font-medium mb-1.5 ${activeAccent.textMuted}`}>
                {exp.role}
              </div>
              <div className="text-slate-700 text-[12px] whitespace-pre-line leading-relaxed pl-1">
                {exp.description}
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  const renderProjects = () => {
    if (!projects || projects.length === 0) return null
    return (
      <section className="">
        <h2 
          className={`text-[12.5px] font-bold uppercase tracking-wider border-b-2 ${activeAccent.border} pb-1 mb-3 text-slate-900`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Proyectos Clave
        </h2>
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="print-avoid-break break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-slate-900 text-[12px]">
                <span>{proj.name}</span>
                {proj.url && (
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-slate-500 hover:underline text-[10.5px]"
                  >
                    Enlace proyecto
                  </a>
                )}
              </div>
              <p className="text-slate-700 mt-1 text-[12px] leading-relaxed">
                {proj.description}
              </p>
              {proj.technologies && proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {proj.technologies.map((tech, i) => (
                    <span key={i} className="bg-slate-100 text-slate-800 text-[9.5px] font-semibold px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  }

  const renderSkills = () => {
    if (!skills || skills.length === 0) return null
    return (
      <section className="">
        <h2 
          className={`text-[12.5px] font-bold uppercase tracking-wider border-b-2 ${activeAccent.border} pb-1 mb-3 text-slate-900`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Habilidades
        </h2>
        <div className="space-y-3">
          {skills.map((skillCat, idx) => (
            <div key={idx} className="bg-slate-50 p-2.5 rounded border border-slate-100 print-avoid-break break-inside-avoid">
              <h3 className="font-bold text-slate-900 text-[11px] uppercase tracking-wide mb-1">
                {skillCat.category}
              </h3>
              <div className="flex flex-wrap gap-1">
                {skillCat.items.map((item, itemIdx) => (
                  <span key={itemIdx} className="bg-white border border-slate-200 text-slate-700 text-[10px] px-1.5 py-0.5 rounded shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  const renderEducation = () => {
    if (!education || education.length === 0) return null
    return (
      <section className="">
        <h2 
          className={`text-[12.5px] font-bold uppercase tracking-wider border-b-2 ${activeAccent.border} pb-1 mb-3 text-slate-900`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Educación
        </h2>
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="print-avoid-break break-inside-avoid">
              <div className="font-bold text-slate-900 text-[11.5px] leading-tight">
                {edu.institution}
              </div>
              <div className={`text-[10.5px] font-semibold ${activeAccent.textMuted}`}>
                {edu.degree}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {edu.startDate} – {edu.endDate}
              </div>
              {edu.description && (
                <p className="text-slate-600 mt-1 text-[11px] leading-snug">
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  }

  const renderLanguages = () => {
    if (!languages || languages.length === 0) return null
    return (
      <section className="">
        <h2 
          className={`text-[12.5px] font-bold uppercase tracking-wider border-b-2 ${activeAccent.border} pb-1 mb-3 text-slate-900`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Idiomas
        </h2>
        <div className="space-y-1.5 print-avoid-break break-inside-avoid">
          {languages.map((lang, idx) => (
            <div key={idx} className="flex justify-between items-center text-slate-700 text-[11.5px] print-avoid-break break-inside-avoid">
              <span className="font-bold text-slate-900">{lang.name}</span>
              <span className="text-slate-500 font-medium">{lang.level}</span>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // Dynamic Ordering & 2-Column Split Logic
  const defaultOrder = ['work', 'education', 'skills', 'projects', 'languages']
  const order = content.sectionOrder || defaultOrder

  // Get sorting index for keys
  const getIndex = (key: string) => {
    const idx = order.indexOf(key)
    return idx === -1 ? 99 : idx
  }

  // Define left column keys and right column keys
  const leftKeys = ['work', 'projects'].sort((a, b) => getIndex(a) - getIndex(b))
  const rightKeys = ['skills', 'education', 'languages'].sort((a, b) => getIndex(a) - getIndex(b))

  const renderKey = (key: string) => {
    switch (key) {
      case 'work':
        return <React.Fragment key="work">{renderExperience()}</React.Fragment>
      case 'projects':
        return <React.Fragment key="projects">{renderProjects()}</React.Fragment>
      case 'education':
        return <React.Fragment key="education">{renderEducation()}</React.Fragment>
      case 'skills':
        return <React.Fragment key="skills">{renderSkills()}</React.Fragment>
      case 'languages':
        return <React.Fragment key="languages">{renderLanguages()}</React.Fragment>
      default:
        return null
    }
  }

  return (
    <div className={`w-full bg-white text-gray-800 p-8 ${fontClass} leading-relaxed text-[12.5px] print:p-0 print:m-0`}>
      {/* Top Banner Header */}
      <header className="border-b-4 border-slate-900 pb-5 mb-5">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            {personalInfo.imageUrl && (
              <img
                src={personalInfo.imageUrl}
                alt={personalInfo.fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-slate-900 shadow-sm animate-fade-in"
              />
            )}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 uppercase">
                {personalInfo.fullName}
              </h1>
              <p className={`text-sm font-semibold tracking-wider uppercase mt-1 ${activeAccent.text}`}>
                {personalInfo.title}
              </p>
            </div>
          </div>
          
          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-slate-600 text-[11px] font-normal min-w-[240px]">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-900">Ubicación:</span>
              <span>{personalInfo.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-900">Tlf:</span>
              <span>{personalInfo.phone}</span>
            </div>
            <div className="flex items-center gap-1 col-span-1 sm:col-span-2">
              <span className="font-semibold text-slate-900">Email:</span>
              <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
            </div>
            {personalInfo.website && (
              <div className="flex items-center gap-1 col-span-1 sm:col-span-2">
                <span className="font-semibold text-slate-900">Web:</span>
                <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">
                  {personalInfo.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-1 col-span-1 sm:col-span-2">
                <span className="font-semibold text-slate-900">LinkedIn:</span>
                <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">
                  {personalInfo.linkedin.replace(/^linkedin\.com\/in\//, '')}
                </a>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-1 col-span-1 sm:col-span-2">
                <span className="font-semibold text-slate-900">GitHub:</span>
                <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline">
                  {personalInfo.github.replace(/^github\.com\//, '')}
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Grid Content - Block and Floats for print mode to prevent page break bugs */}
      <div className="block print:block md:grid md:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width) - Experience & Projects */}
        <div className="w-full print:w-[65%] print:float-left md:col-span-2 space-y-6">
          {/* Summary always goes first in the column */}
          {renderSummary()}
 
          {/* Render Left Column Sections according to relative sectionOrder */}
          {leftKeys.map(renderKey)}
        </div>
 
        {/* Right Column (1/3 width) - Education, Skills, Languages */}
        <div className="w-full print:w-[30%] print:float-right space-y-6">
          {/* Render Right Column Sections according to relative sectionOrder */}
          {rightKeys.map(renderKey)}
        </div>
 
      </div>
      <div className="clear-both print:block hidden"></div>
    </div>
  )
}
