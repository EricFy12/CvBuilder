import React from 'react'
import { ResumeContent } from '@/types/resume'

interface CreativeHandoutProps {
  content: ResumeContent
  fontClass?: string
  accentColor?: string // e.g. "indigo", "emerald", "sky", "slate" (and we support a custom golden touch!)
}

export default function CreativeHandout({ 
  content, 
  fontClass = 'font-sans',
  accentColor = 'indigo'
}: CreativeHandoutProps) {
  const { personalInfo, summary, experience, education, skills, projects, languages, skillsDisplayMode, fontSize } = content
  const isCompact = !!content.isCompact

  const sectionMargin = isCompact ? 'mb-3.5' : 'mb-6'
  const entrySpacing = isCompact ? 'space-y-2.5' : 'space-y-4.5'
  const rootFontSizeClass = fontSize === 'sm' ? 'text-sm' : fontSize === 'lg' ? 'text-lg' : 'text-base'
  const textBodySize = fontSize === 'sm' ? 'text-[11px]' : fontSize === 'lg' ? 'text-[13px]' : (isCompact ? 'text-[11px]' : 'text-[12px]')
  const imageSize = isCompact ? 'w-14 h-14' : 'w-18 h-18'
  const containerPadding = isCompact ? 'p-6' : 'p-10'
  const skillsBoxPadding = isCompact ? 'p-1.5' : 'p-2'

  // Accent styles map (featuring golden touch/amber for this template!)
  const accents: Record<string, { bg: string, text: string, border: string, textMuted: string, banner: string }> = {
    indigo: {
      bg: 'bg-indigo-600',
      text: 'text-indigo-600',
      border: 'border-indigo-600',
      textMuted: 'text-indigo-800',
      banner: 'bg-indigo-50/80 text-indigo-900'
    },
    emerald: {
      bg: 'bg-emerald-600',
      text: 'text-emerald-600',
      border: 'border-emerald-600',
      textMuted: 'text-emerald-800',
      banner: 'bg-emerald-50/80 text-emerald-900'
    },
    sky: {
      bg: 'bg-sky-600',
      text: 'text-sky-600',
      border: 'border-sky-600',
      textMuted: 'text-sky-800',
      banner: 'bg-sky-50/80 text-sky-900'
    },
    slate: {
      bg: 'bg-slate-800',
      text: 'text-amber-600', // Ochre/Golden touch by default for Slate to reflect the picture style!
      border: 'border-slate-800',
      textMuted: 'text-amber-800',
      banner: 'bg-slate-100 text-slate-900'
    }
  }

  const activeAccent = accents[accentColor] || accents.indigo

  // Render modular blocks
  const renderSummary = () => {
    if (!summary) return null
    return (
      <section className={sectionMargin}>
        <h2 
          className={`${isCompact ? 'text-[11px] pb-0.5 mb-1.5' : 'text-[12px] pb-1 mb-2.5'} font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Sobre Mí
        </h2>
        <p className={`text-slate-700 text-justify ${textBodySize} leading-relaxed whitespace-pre-line print-avoid-break break-inside-avoid`}>
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
          className={`${isCompact ? 'text-[11px] pb-0.5 mb-2' : 'text-[12px] pb-1 mb-3.5'} font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Experiencia Profesional
        </h2>
        <div className={entrySpacing}>
          {experience.map((exp) => (
            <div key={exp.id} className="print-avoid-break break-inside-avoid">
              <div className={`flex justify-between items-baseline font-bold text-slate-900 ${textBodySize}`}>
                <span className={isCompact ? 'text-[11.5px]' : 'text-[12.5px]'}>{exp.company}</span>
                <span className={`font-semibold text-slate-500 ${isCompact ? 'text-[9px]' : 'text-[10px]'}`}>
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <div className={`${isCompact ? 'text-[9.5px]' : 'text-[10.5px]'} font-bold tracking-wide uppercase mt-0.5 ${activeAccent.text}`}>
                {exp.role}
              </div>
              <div className={`text-slate-655 ${isCompact ? 'text-[10.5px] mt-1' : 'text-[11.5px] mt-1.5'} whitespace-pre-line leading-relaxed pl-1`}>
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
          className={`${isCompact ? 'text-[10.5px] pb-0.5 mb-2' : 'text-[11.5px] pb-1 mb-3'} font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Educación
        </h2>
        <div className={isCompact ? 'space-y-1.5' : 'space-y-3'}>
          {education.map((edu) => (
            <div key={edu.id} className="print-avoid-break break-inside-avoid">
              <div className={`font-bold text-slate-900 ${isCompact ? 'text-[10.5px]' : 'text-[11.5px]'} leading-tight`}>
                {edu.institution}
              </div>
              <div className={`${isCompact ? 'text-[9.5px]' : 'text-[10.5px]'} font-semibold ${activeAccent.text}`}>
                {edu.degree}
              </div>
              <div className={`${isCompact ? 'text-[8.5px]' : 'text-[9.5px]'} text-slate-450 font-medium`}>
                {edu.startDate} – {edu.endDate}
              </div>
              {edu.description && (
                <p className={`text-slate-550 ${isCompact ? 'mt-0.5 text-[9.5px]' : 'mt-1 text-[10.5px]'} leading-snug`}>
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
          className={`${isCompact ? 'text-[11px] pb-0.5 mb-2' : 'text-[12px] pb-1 mb-3.5'} font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Proyectos Destacados
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
                    className={`font-medium text-slate-500 hover:underline ${isCompact ? 'text-[9px]' : 'text-[10px]'}`}
                  >
                    Enlace
                  </a>
                )}
              </div>
              <p className={`text-slate-655 ${isCompact ? 'mt-0.5 text-[10.5px]' : 'mt-1 text-[11.5px]'} leading-relaxed`}>
                {proj.description}
              </p>
              {proj.technologies && proj.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {proj.technologies.map((tech, i) => (
                    <span key={i} className={`bg-slate-100 text-slate-700 ${isCompact ? 'text-[8px]' : 'text-[9px]'} font-semibold px-2 py-0.5 rounded`}>
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
          className={`${isCompact ? 'text-[10.5px] pb-0.5 mb-2' : 'text-[11.5px] pb-1 mb-3'} font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Habilidades
        </h2>
        {isInline ? (
          <p className="text-slate-700 text-justify leading-relaxed text-[11px] whitespace-normal pt-1 print-avoid-break break-inside-avoid">
            {skills.flatMap(category => category.items).join('  •  ')}
          </p>
        ) : (
          <div className={isCompact ? 'space-y-2' : 'space-y-3'}>
            {skills.map((skillCat, idx) => (
              <div key={idx} className={`bg-[#fcfbf9] border border-slate-200/60 ${skillsBoxPadding} rounded-lg shadow-sm print-avoid-break break-inside-avoid`}>
                <h3 className={`font-bold text-slate-900 ${isCompact ? 'text-[9.5px] mb-1' : 'text-[10.5px] mb-1.5'} uppercase tracking-wide`}>
                  {skillCat.category}
                </h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {skillCat.items.map((item, itemIdx) => (
                    <span key={itemIdx} className={`bg-white border border-slate-250 text-slate-700 ${isCompact ? 'text-[8.5px]' : 'text-[9.5px]'} font-medium px-2 py-0.5 rounded shadow-sm`}>
                      {item}
                    </span>
                  ))}
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
          className={`${isCompact ? 'text-[10.5px] pb-0.5 mb-2' : 'text-[11.5px] pb-1 mb-3'} font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200`}
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Idiomas
        </h2>
        <div className={isCompact ? 'space-y-1' : 'space-y-1.5'}>
          {languages.map((lang, idx) => (
            <div key={idx} className={`flex justify-between items-center text-slate-655 ${isCompact ? 'text-[10px]' : 'text-[11px]'} print-avoid-break break-inside-avoid`}>
              <span className="font-bold text-slate-950">{lang.name}</span>
              <span className="text-slate-500 font-semibold">{lang.level}</span>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // Dynamic Section ordering & columns split
  const defaultOrder = ['work', 'education', 'skills', 'projects', 'languages']
  const order = content.sectionOrder || defaultOrder

  const getIndex = (key: string) => {
    const idx = order.indexOf(key)
    return idx === -1 ? 99 : idx
  }

  // Sort sections for 2 columns layout dynamically
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
    <div className={`w-full bg-[#fafafa] text-slate-800 ${containerPadding} ${fontClass} leading-relaxed ${rootFontSizeClass} print:p-0 print:m-0 print:bg-white print:bg-opacity-100 [-webkit-print-color-adjust:exact]`}>
      
      {/* Three Horizontal Blocks Header (Handout design) */}
      <header className={`grid grid-cols-3 items-center gap-4 border-b border-slate-200 ${isCompact ? 'pb-3.5 mb-3.5' : 'pb-5 mb-5'} select-none`}>
        
        {/* Block 1 (Left): Name & Professional Role */}
        <div className="text-left space-y-1">
          <h1 className={`${isCompact ? 'text-lg' : 'text-2xl'} font-black tracking-tight text-slate-900 uppercase leading-none`}>
            {personalInfo.fullName}
          </h1>
          <p className={`${isCompact ? 'text-[9.5px] mt-0.5' : 'text-[10.5px] mt-1'} font-bold tracking-widest uppercase ${activeAccent.text}`}>
            {personalInfo.title}
          </p>
        </div>

        {/* Block 2 (Center): Circular Photo */}
        <div className="flex justify-center">
          {personalInfo.imageUrl ? (
            <img
              src={personalInfo.imageUrl}
              alt={personalInfo.fullName}
              className={`${imageSize} rounded-full object-cover border-2 border-white ring-4 ring-slate-100 shadow-md transition hover:scale-105 duration-300`}
            />
          ) : (
            <div className={`${imageSize} rounded-full bg-slate-200 border-2 border-white ring-4 ring-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs shadow-inner`}>
              CV
            </div>
          )}
        </div>

        {/* Block 3 (Right): Labeled Contact Details (Right-Aligned) */}
        <div className={`text-right flex flex-col gap-0.5 text-slate-500 ${isCompact ? 'text-[9px]' : 'text-[10px]'} font-normal`}>
          <div>
            <span className="font-bold text-slate-800">Dirección:</span> {personalInfo.location}
          </div>
          <div>
            <span className="font-bold text-slate-800">Tlf:</span> {personalInfo.phone}
          </div>
          <div>
            <span className="font-bold text-slate-800">Email:</span>{' '}
            <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
          </div>
          {personalInfo.website && (
            <div>
              <span className="font-bold text-slate-800">Web:</span>{' '}
              <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">
                {personalInfo.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Two Column Layout Body - Block and Floats for print mode to prevent page break bugs */}
      <div className={`block print:block md:grid md:grid-cols-3 ${isCompact ? 'gap-4 mt-2' : 'gap-8 mt-4'}`}>
        
        {/* Left Column (2/3 width) - Profile & Experience */}
        <div className={`w-full print:w-[65%] print:float-left md:col-span-2 ${isCompact ? 'space-y-3' : 'space-y-6'}`}>
          {/* Summary always goes first in left column */}
          {renderSummary()}
 
          {/* Ordered left sections */}
          {leftKeys.map(renderKey)}
        </div>
 
        {/* Right Column (1/3 width) - Education, Skills, Languages */}
        <div className={`w-full print:w-[30%] print:float-right ${isCompact ? 'space-y-3' : 'space-y-6'}`}>
          {/* Ordered right sections */}
          {rightKeys.map(renderKey)}
        </div>
      </div>
      <div className="clear-both print:block hidden"></div>
    </div>
  )
}
