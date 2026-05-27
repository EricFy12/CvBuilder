import React from 'react'
import { ResumeContent } from '@/types/resume'

interface HybridModernProps {
  content: ResumeContent
  fontClass?: string
  accentColor?: string // e.g. "indigo", "emerald", "sky", "slate"
}

export default function HybridModern({
  content,
  fontClass = 'font-sans',
  accentColor = 'indigo'
}: HybridModernProps) {
  const { personalInfo, summary, experience, education, skills, projects, languages, skillsDisplayMode, avatarPosition, fontSize } = content
  const isCompact = !!content.isCompact
  const isSide = !avatarPosition || avatarPosition === 'side'

  const sectionMargin = isCompact ? 'mb-2.5' : 'mb-5'
  const rootFontSizeClass = fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg' : 'text-base'
  const textBodySize = fontSize === 'sm' ? 'text-[11px]' : fontSize === 'lg' ? 'text-[13px]' : (isCompact ? 'text-[11px]' : 'text-[12px]')
  const entrySpacing = isCompact ? 'space-y-2' : 'space-y-4'

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
      <section className={sectionMargin}>
        <h2 
          className={`${isCompact ? 'text-[11px] pb-0.5 mb-1.5' : 'text-[12.5px] pb-1 mb-2.5'} font-extrabold uppercase tracking-wider border-b-2 ${activeAccent.border} ${activeAccent.text}`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Perfil Profesional
        </h2>
        <p className={`text-slate-700 text-justify leading-relaxed whitespace-pre-line ${textBodySize}`}>
          {summary}
        </p>
      </section>
    )
  }

  const renderExperience = () => {
    if (!experience || experience.length === 0) return null
    return (
      <section className={sectionMargin}>
        <h2 
          className={`${isCompact ? 'text-[11px] pb-0.5 mb-2' : 'text-[12.5px] pb-1 mb-3'} font-extrabold uppercase tracking-wider border-b-2 ${activeAccent.border} ${activeAccent.text}`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Trayectoria Profesional
        </h2>
        <div className={entrySpacing}>
          {experience.map((exp) => (
            <div key={exp.id} className="print-avoid-break break-inside-avoid">
              <div className={`flex justify-between items-baseline font-bold text-slate-900 ${textBodySize}`}>
                <span>{exp.company}</span>
                <span className={`font-semibold text-slate-500 ${isCompact ? 'text-[9.5px]' : 'text-[10.5px]'}`}>
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <div className={`${isCompact ? 'text-[10px] mb-0.5' : 'text-[11px] mb-1'} font-semibold italic ${activeAccent.textMuted}`}>
                {exp.role}
              </div>
              <div className={`text-slate-700 ${textBodySize} whitespace-pre-line leading-relaxed pl-1`}>
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
      <section className={sectionMargin}>
        <h2 
          className={`${isCompact ? 'text-[11px] pb-0.5 mb-2' : 'text-[12.5px] pb-1 mb-3'} font-extrabold uppercase tracking-wider border-b-2 ${activeAccent.border} ${activeAccent.text}`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Educación
        </h2>
        <div className={isCompact ? 'space-y-1.5' : 'space-y-3'}>
          {education.map((edu) => (
            <div key={edu.id} className="print-avoid-break break-inside-avoid">
              <div className={`flex justify-between items-baseline font-bold text-slate-900 ${textBodySize}`}>
                <span>{edu.institution}</span>
                <span className={`font-semibold text-slate-500 ${isCompact ? 'text-[9.5px]' : 'text-[10.5px]'}`}>
                  {edu.startDate}  {edu.endDate}
                  {/* arriba en medio de date podes poner - */}
                </span>
              </div>
              <div className={`${isCompact ? 'text-[10.5px]' : 'text-[11.5px]'} font-semibold ${activeAccent.textMuted}`}>
                {edu.degree}  {edu.fieldOfStudy}
                {/* arriba en medio de degree podes poner en */}
              </div>
              {edu.description && (
                <p className={`text-slate-655 mt-0.5 ${isCompact ? 'text-[10px]' : 'text-[11px]'} leading-snug`}>
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
      <section className={sectionMargin}>
        <h2 
          className={`${isCompact ? 'text-[11px] pb-0.5 mb-2' : 'text-[12.5px] pb-1 mb-3'} font-extrabold uppercase tracking-wider border-b-2 ${activeAccent.border} ${activeAccent.text}`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Proyectos Clave
        </h2>
        <div className={isCompact ? 'space-y-1.5' : 'space-y-3'}>
          {projects.map((proj) => (
            <div key={proj.id} className="print-avoid-break break-inside-avoid">
              <div className={`flex justify-between items-baseline font-bold text-slate-900 ${textBodySize}`}>
                <span>{proj.name}</span>
                {proj.url && (
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`font-medium text-slate-500 hover:underline ${isCompact ? 'text-[9.5px]' : 'text-[10.5px]'}`}
                  >
                    Enlace proyecto
                  </a>
                )}
              </div>
              <p className={`text-slate-700 mt-0.5 ${textBodySize} leading-relaxed`}>
                {proj.description}
              </p>
              {proj.technologies && proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {proj.technologies.map((tech, i) => (
                    <span key={i} className={`bg-slate-100 text-slate-800 ${isCompact ? 'text-[8.5px] px-1.5 py-0' : 'text-[9.5px] px-2 py-0.5'} font-semibold rounded`}>
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
    const isInline = skillsDisplayMode === 'inline'
 
    return (
      <section className={sectionMargin}>
        <h2 
          className={`${isCompact ? 'text-[11px] pb-0.5 mb-2' : 'text-[12.5px] pb-1 mb-3'} font-extrabold uppercase tracking-wider border-b-2 ${activeAccent.border} ${activeAccent.text}`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Habilidades
        </h2>
        {isInline ? (
          <p className={`text-slate-700 text-justify leading-relaxed ${textBodySize} whitespace-normal print-avoid-break break-inside-avoid`}>
            {skills.flatMap(category => category.items).join('  •  ')}
          </p>
        ) : (
          <div className={isCompact ? 'space-y-2' : 'space-y-3'}>
            {skills.map((skillCat, idx) => (
              <div key={idx} className={`${textBodySize} print-avoid-break break-inside-avoid`}>
                <div className="flex flex-col gap-1.5">
                  <span className="text-slate-900 font-bold">{skillCat.category}:</span>
                  <div className="flex flex-wrap gap-1">
                    {skillCat.items.map((item, itemIdx) => (
                      <span key={itemIdx} className={`bg-slate-100 border border-slate-200/50 text-slate-800 font-semibold rounded shadow-sm ${isCompact ? 'text-[8.5px] px-1.5 py-0.5' : 'text-[9.5px] px-2 py-0.5'}`}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    )
  }

  const renderLanguages = () => {
    if (!languages || languages.length === 0) return null
    return (
      <section className={sectionMargin}>
        <h2 
          className={`${isCompact ? 'text-[11px] pb-0.5 mb-2' : 'text-[12.5px] pb-1 mb-3'} font-extrabold uppercase tracking-wider border-b-2 ${activeAccent.border} ${activeAccent.text}`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Idiomas
        </h2>
        <div className={`flex flex-wrap gap-x-6 gap-y-1 text-slate-700 ${textBodySize} print-avoid-break break-inside-avoid`}>
          {languages.map((lang, idx) => (
            <div key={idx} className="flex gap-1.5">
              <span className="font-bold text-slate-950">{lang.name}:</span>
              <span className="text-slate-655 font-medium">{lang.level}</span>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // Dynamic Section ordering
  const defaultOrder = ['work', 'education', 'skills', 'projects', 'languages']
  const order = content.sectionOrder || defaultOrder

  return (
    <div className={`w-full bg-white text-slate-800 ${isCompact ? 'p-6' : 'p-10'} ${fontClass} leading-relaxed ${rootFontSizeClass} print:p-0 print:m-0`}>

      {/* Centered Header Layout (Classic structure, Modern style, Visible photo) */}
      <header className={isSide 
        ? `flex flex-row items-center justify-between gap-6 text-left ${isCompact ? 'pb-3 mb-3' : 'pb-5 mb-5'} border-b-2 border-slate-900`
        : `text-center ${isCompact ? 'pb-3 mb-3 border-b-2' : 'pb-5 mb-5 border-b-4'} border-slate-900`
      }>
        {isSide ? (
          <>
            <div className="flex-1 space-y-1.5">
              <h1 className={`${isCompact ? 'text-xl' : 'text-3xl'} font-black tracking-tight text-slate-900 uppercase`}>
                {personalInfo.fullName}
              </h1>
              <p className={`${isCompact ? 'text-[11px] mt-0.5' : 'text-sm mt-1'} font-bold tracking-wider uppercase ${activeAccent.text}`}>
                {personalInfo.title}
              </p>
              
              {/* Labeled Contact Info Details */}
              <div className={`flex flex-wrap justify-start gap-x-3 gap-y-1 text-slate-650 mt-2.5 ${isCompact ? 'text-[9.5px]' : 'text-[10px]'} font-normal`}>
                <span><strong className="text-slate-900">Ubicación:</strong> {personalInfo.location}</span>
                <span>•</span>
                <span><strong className="text-slate-900">Teléfono:</strong> {personalInfo.phone}</span>
                <span>•</span>
                <span>
                  <strong className="text-slate-900">Email:</strong>{' '}
                  <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
                </span>
                
                {personalInfo.website && (
                  <>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-900">Web:</strong>{' '}
                      <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">
                        {personalInfo.website.replace(/^https?:\/\//, '')}
                      </a>
                    </span>
                  </>
                )}
                {personalInfo.linkedin && (
                  <>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-900">LinkedIn:</strong>{' '}
                      <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">
                        {personalInfo.linkedin.replace(/^linkedin\.com\/in\//, '')}
                      </a>
                    </span>
                  </>
                )}
                {personalInfo.github && (
                  <>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-900">GitHub:</strong>{' '}
                      <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline">
                        {personalInfo.github.replace(/^github\.com\//, '')}
                      </a>
                    </span>
                  </>
                )}
              </div>
            </div>
            {personalInfo.imageUrl && (
              <div className="shrink-0">
                <img
                  src={personalInfo.imageUrl}
                  alt={personalInfo.fullName}
                  className={`${isCompact ? 'w-14 h-14' : 'w-20 h-20'} rounded-full object-cover border-2 border-slate-900 shadow-sm`}
                />
              </div>
            )}
          </>
        ) : (
          <>
            {personalInfo.imageUrl && (
              <div className={`flex justify-center ${isCompact ? 'mb-2' : 'mb-3'}`}>
                <img
                  src={personalInfo.imageUrl}
                  alt={personalInfo.fullName}
                  className={`${isCompact ? 'w-14 h-14' : 'w-20 h-20'} rounded-full object-cover border-2 border-slate-900 shadow-sm`}
                />
              </div>
            )}
            
            <h1 className={`${isCompact ? 'text-xl' : 'text-3xl'} font-black tracking-tight text-slate-900 uppercase`}>
              {personalInfo.fullName}
            </h1>
            <p className={`${isCompact ? 'text-[11px] mt-0.5' : 'text-sm mt-1'} font-bold tracking-wider uppercase ${activeAccent.text}`}>
              {personalInfo.title}
            </p>
            
            {/* Labeled Contact Info Details */}
            <div className={`flex flex-wrap justify-center gap-x-4 gap-y-1 text-slate-600 mt-2.5 ${isCompact ? 'text-[9.5px]' : 'text-[10.5px]'} font-normal max-w-2xl mx-auto`}>
              <span><strong className="text-slate-900">Ubicación:</strong> {personalInfo.location}</span>
              <span>•</span>
              <span><strong className="text-slate-900">Teléfono:</strong> {personalInfo.phone}</span>
              <span>•</span>
              <span>
                <strong className="text-slate-900">Email:</strong>{' '}
                <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
              </span>
              
              {personalInfo.website && (
                <>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-900">Web:</strong>{' '}
                    <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">
                      {personalInfo.website.replace(/^https?:\/\//, '')}
                    </a>
                  </span>
                </>
              )}
              {personalInfo.linkedin && (
                <>
                  <span>•</span>
                  <span>
                    <strong className="text-slate-900">LinkedIn:</strong>{' '}
                    <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">
                      {personalInfo.linkedin.replace(/^linkedin\.com\/in\//, '')}
                    </a>
                  </span>
                </>
              )}
                {personalInfo.github && (
                  <>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-900">GitHub:</strong>{' '}
                      <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline">
                        {personalInfo.github.replace(/^github\.com\//, '')}
                      </a>
                    </span>
                  </>
                )}
              </div>
            </>
          )}
      </header>


      {/* Summary always goes first under header */}
      {renderSummary()}

      {/* Render sections in dynamic order sequence */}
      <div className={isCompact ? 'space-y-2' : 'space-y-4'}>
        {order.map((key) => {
          switch (key) {
            case 'work':
              return <React.Fragment key="work">{renderExperience()}</React.Fragment>
            case 'education':
              return <React.Fragment key="education">{renderEducation()}</React.Fragment>
            case 'projects':
              return <React.Fragment key="projects">{renderProjects()}</React.Fragment>
            case 'skills':
              return <React.Fragment key="skills">{renderSkills()}</React.Fragment>
            case 'languages':
              return <React.Fragment key="languages">{renderLanguages()}</React.Fragment>
            default:
              return null
          }
        })}
      </div>
    </div>
  )
}
