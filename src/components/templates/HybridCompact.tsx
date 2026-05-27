import React from 'react'
import { ResumeContent } from '@/types/resume'

interface HybridCompactProps {
  content: ResumeContent
  fontClass?: string
  accentColor?: string // e.g. "indigo", "emerald", "sky", "slate"
}

export default function HybridCompact({ 
  content, 
  fontClass = 'font-sans',
  accentColor = 'indigo'
}: HybridCompactProps) {
  const { personalInfo, summary, experience, education, skills, projects, languages } = content

  // Accents configuration
  const accents: Record<string, { text: string, border: string, bg: string, textMuted: string }> = {
    indigo: {
      text: 'text-indigo-600',
      border: 'border-indigo-600',
      bg: 'bg-indigo-50',
      textMuted: 'text-indigo-800'
    },
    emerald: {
      text: 'text-emerald-600',
      border: 'border-emerald-600',
      bg: 'bg-emerald-50',
      textMuted: 'text-emerald-800'
    },
    sky: {
      text: 'text-sky-600',
      border: 'border-sky-600',
      bg: 'bg-sky-50',
      textMuted: 'text-sky-800'
    },
    slate: {
      text: 'text-slate-800',
      border: 'border-slate-800',
      bg: 'bg-slate-100',
      textMuted: 'text-slate-900'
    }
  }

  const activeAccent = accents[accentColor] || accents.indigo

  // Render subcomponents for modularity
  const renderSummary = () => {
    if (!summary) return null
    return (
      <section className="mb-4">
        <h2 
          className={`text-[11.5px] font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-1.5 text-slate-900`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Perfil Profesional
        </h2>
        <p className="text-slate-700 text-justify text-[11.5px] leading-relaxed whitespace-pre-line print-avoid-break break-inside-avoid">
          {summary}
        </p>
      </section>
    )
  }

  const renderExperience = () => {
    if (!experience || experience.length === 0) return null
    return (
      <section className="mb-4">
        <h2 
          className={`text-[11.5px] font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-2 text-slate-900`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Experiencia Profesional
        </h2>
        <div className="space-y-3">
          {experience.map((exp) => (
            <div key={exp.id} className="print-avoid-break break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-slate-900 text-[11.5px]">
                <span>{exp.company}</span>
                <span className="font-semibold text-slate-500 text-[10px]">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <div className={`text-[10.5px] font-medium italic ${activeAccent.text}`}>
                {exp.role}
              </div>
              <div className="text-slate-700 text-[11px] whitespace-pre-line leading-relaxed pl-1 mt-0.5">
                {exp.description}
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
      <section className="mb-4">
        <h2 
          className={`text-[11.5px] font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-2 text-slate-900`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Educación y Formación
        </h2>
        <div className="space-y-2">
          {education.map((edu) => (
            <div key={edu.id} className="print-avoid-break break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-slate-900 text-[11.5px]">
                <span>{edu.institution}</span>
                <span className="font-semibold text-slate-500 text-[10px]">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div className="text-slate-700 font-semibold text-[10.5px]">
                {edu.degree} en {edu.fieldOfStudy}
              </div>
              {edu.description && (
                <p className="text-slate-655 mt-0.5 text-[10px] leading-snug">
                  {edu.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  }

  const renderProjects = () => {
    if (!projects || projects.length === 0) return null
    return (
      <section className="mb-4">
        <h2 
          className={`text-[11.5px] font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-2 text-slate-900`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Proyectos Clave
        </h2>
        <div className="space-y-2.5">
          {projects.map((proj) => (
            <div key={proj.id} className="print-avoid-break break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-slate-900 text-[11.5px]">
                <span>{proj.name}</span>
                {proj.url && (
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-slate-500 hover:underline text-[9.5px]"
                  >
                    Ver código/demo
                  </a>
                )}
              </div>
              <p className="text-slate-700 mt-0.5 text-[11px] leading-relaxed">
                {proj.description}
              </p>
              {proj.technologies && proj.technologies.length > 0 && (
                <p className="text-slate-550 mt-0.5 text-[9.5px] font-medium">
                  Tecnologías: {proj.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  }

  const renderSkills = (isHalfWidth = false) => {
    if (!skills || skills.length === 0) return null
    return (
      <section className={isHalfWidth ? '' : 'mb-4'}>
        <h2 
          className={`text-[11.5px] font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-2 text-slate-900`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Habilidades Técnicas
        </h2>
        <div className="space-y-1.5 print-avoid-break break-inside-avoid">
          {skills.map((skillCat, idx) => (
            <div key={idx} className="text-[11px] print-avoid-break break-inside-avoid">
              <span className="font-bold text-slate-900 block sm:inline">{skillCat.category}:</span>{' '}
              <span className="text-slate-700">{skillCat.items.join(', ')}</span>
            </div>
          ))}
        </div>
      </section>
    )
  }

  const renderLanguages = (isHalfWidth = false) => {
    if (!languages || languages.length === 0) return null
    return (
      <section className={isHalfWidth ? '' : 'mb-4'}>
        <h2 
          className={`text-[11.5px] font-bold uppercase tracking-wider border-b border-slate-900 pb-0.5 mb-2 text-slate-900`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Idiomas
        </h2>
        <div className="space-y-1 text-[11px] print-avoid-break break-inside-avoid">
          {languages.map((lang, idx) => (
            <div key={idx} className="flex justify-between items-center py-0.5 border-b border-slate-100 last:border-b-0 print-avoid-break break-inside-avoid">
              <span className="font-bold text-slate-900">{lang.name}</span>
              <span className="text-slate-500 font-medium">{lang.level}</span>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // Section Ordering Logic
  const defaultOrder = ['work', 'education', 'skills', 'languages']
  const order = content.sectionOrder || defaultOrder

  const renderOrderedSections = () => {
    const elements: React.ReactNode[] = []
    
    for (let i = 0; i < order.length; i++) {
      const currentKey = order[i]
      const nextKey = order[i + 1]

      // OPTIMIZACIÓN: Si 'skills' y 'languages' son consecutivos en el orden, renderizarlos lado a lado
      if (
        (currentKey === 'skills' && nextKey === 'languages') ||
        (currentKey === 'languages' && nextKey === 'skills')
      ) {
        elements.push(
          <div key={`grid-${currentKey}-${nextKey}`} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 print-avoid-break">
            <div>
              {currentKey === 'skills' ? renderSkills(true) : renderLanguages(true)}
            </div>
            <div>
              {nextKey === 'skills' ? renderSkills(true) : renderLanguages(true)}
            </div>
          </div>
        )
        // Saltar el siguiente elemento ya que lo renderizamos lado a lado
        i++
      } else {
        // Renderizado normal de una sola sección
        switch (currentKey) {
          case 'work':
            elements.push(<React.Fragment key="work">{renderExperience()}</React.Fragment>)
            break
          case 'education':
            elements.push(<React.Fragment key="education">{renderEducation()}</React.Fragment>)
            break
          case 'projects':
            elements.push(<React.Fragment key="projects">{renderProjects()}</React.Fragment>)
            break
          case 'skills':
            elements.push(<React.Fragment key="skills">{renderSkills(false)}</React.Fragment>)
            break
          case 'languages':
            elements.push(<React.Fragment key="languages">{renderLanguages(false)}</React.Fragment>)
            break
          default:
            break
        }
      }
    }

    return elements
  }

  return (
    <div className={`w-full bg-white text-slate-800 p-8 ${fontClass} leading-tight text-[11.5px] print:p-0 print:m-0`}>
      
      {/* Compact Header Layout */}
      <header className="border-b-2 border-slate-900 pb-3 mb-3">
        <div className="flex items-center gap-5">
          {personalInfo.imageUrl && (
            <img
              src={personalInfo.imageUrl}
              alt={personalInfo.fullName}
              className="w-16 h-16 rounded-full object-cover border border-slate-350 shadow-sm flex-shrink-0"
            />
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
              <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">
                  {personalInfo.fullName}
                </h1>
                <p className={`text-[10px] font-bold tracking-wider uppercase mt-1 ${activeAccent.text}`}>
                  {personalInfo.title}
                </p>
              </div>
              
              {/* Compact 2-column contact grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-0.5 text-slate-600 text-[10px] font-normal min-w-[220px]">
                <div>
                  <span className="font-semibold text-slate-900">Ubicación:</span> {personalInfo.location}
                </div>
                <div>
                  <span className="font-semibold text-slate-900">Tlf:</span> {personalInfo.phone}
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold text-slate-900">Email:</span>{' '}
                  <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
                </div>
                {personalInfo.website && (
                  <div className="sm:col-span-2 truncate">
                    <span className="font-semibold text-slate-900">Web:</span>{' '}
                    <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">
                      {personalInfo.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {(personalInfo.linkedin || personalInfo.github) && (
                  <div className="sm:col-span-2 truncate">
                    {personalInfo.linkedin && (
                      <span className="mr-2">
                        <span className="font-semibold text-slate-900">LN:</span>{' '}
                        <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">
                          {personalInfo.linkedin.replace(/^linkedin\.com\/in\//, '')}
                        </a>
                      </span>
                    )}
                    {personalInfo.github && (
                      <span>
                        <span className="font-semibold text-slate-900">GH:</span>{' '}
                        <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline">
                          {personalInfo.github.replace(/^github\.com\//, '')}
                        </a>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Summary always goes first under header */}
      {renderSummary()}

      {/* Render ordered sections dynamically */}
      <div className="space-y-4">
        {renderOrderedSections()}
      </div>

    </div>
  )
}
