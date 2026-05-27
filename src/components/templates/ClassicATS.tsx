import React from 'react'
import { ResumeContent } from '@/types/resume'

interface ClassicATSProps {
  content: ResumeContent
  fontClass?: string
}

export default function ClassicATS({ content, fontClass = 'font-sans' }: ClassicATSProps) {
  const { personalInfo, summary, experience, education, skills, projects, languages } = content

  // Render modular blocks
  const renderSummary = () => {
    if (!summary) return null
    return (
      <section className="mb-5">
        <h2 
          className="text-[12px] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-950 pb-0.5 mb-2"
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Resumen Profesional
        </h2>
        <p className="text-gray-800 text-justify leading-relaxed whitespace-pre-line print-avoid-break break-inside-avoid">
          {summary}
        </p>
      </section>
    )
  }

  const renderExperience = () => {
    if (!experience || experience.length === 0) return null
    return (
      <section className="mb-5">
        <h2 
          className="text-[12px] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-950 pb-0.5 mb-3"
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Experiencia Profesional
        </h2>
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="print-avoid-break break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-gray-900 text-[12px]">
                <span>{exp.company}</span>
                <span className="font-semibold text-gray-600 text-[11px]">
                  {exp.startDate} – {exp.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline italic text-gray-700 text-[11px] mb-1.5">
                <span>{exp.role}</span>
              </div>
              <div className="text-gray-800 text-[12px] whitespace-pre-line leading-relaxed pl-1">
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
      <section className="mb-5">
        <h2 
          className="text-[12px] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-950 pb-0.5 mb-3"
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Educación y Formación
        </h2>
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="print-avoid-break break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-gray-900 text-[12px]">
                <span>{edu.institution}</span>
                <span className="font-semibold text-gray-600 text-[11px]">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div className="text-gray-700 font-semibold text-[11px]">
                {edu.degree} en {edu.fieldOfStudy}
              </div>
              {edu.description && (
                <p className="text-gray-600 mt-1 leading-relaxed text-[11.5px]">
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
      <section className="mb-5">
        <h2 
          className="text-[12px] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-950 pb-0.5 mb-3"
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Proyectos Destacados
        </h2>
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="print-avoid-break break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-gray-900 text-[12px]">
                <span>{proj.name}</span>
                {proj.url && (
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-gray-600 hover:underline text-[11px]"
                  >
                    {proj.url.replace(/^https?:\/\/(www\.)?/, '')}
                  </a>
                )}
              </div>
              <p className="text-gray-800 mt-1 leading-relaxed text-[12px]">
                {proj.description}
              </p>
              {proj.technologies && proj.technologies.length > 0 && (
                <p className="text-gray-600 mt-1 text-[11px] font-semibold">
                  Tecnologías: {proj.technologies.join(', ')}
                </p>
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
      <section className="mb-5">
        <h2 
          className="text-[12px] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-950 pb-0.5 mb-2"
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Habilidades Técnicas
        </h2>
        <div className="space-y-1 print-avoid-break break-inside-avoid">
          {skills.map((skillCat, idx) => (
            <p key={idx} className="text-gray-800 text-[12px]">
              <strong className="text-gray-900 font-semibold">{skillCat.category}:</strong>{' '}
              {skillCat.items.join(', ')}
            </p>
          ))}
        </div>
      </section>
    )
  }

  const renderLanguages = () => {
    if (!languages || languages.length === 0) return null
    return (
      <section className="mb-5">
        <h2 
          className="text-[12px] font-bold text-gray-900 uppercase tracking-wider border-b border-gray-950 pb-0.5 mb-2"
          style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
        >
          Idiomas
        </h2>
        <p className="text-gray-800 text-[12px] print-avoid-break break-inside-avoid">
          {languages.map((lang, idx) => (
            <span key={idx}>
              <strong className="text-gray-900 font-semibold">{lang.name}</strong> ({lang.level})
              {idx < languages.length - 1 ? ' | ' : ''}
            </span>
          ))}
        </p>
      </section>
    )
  }

  // Section Ordering Logic
  const defaultOrder = ['work', 'education', 'skills', 'projects', 'languages']
  const order = content.sectionOrder || defaultOrder

  return (
    <div className={`w-full bg-white text-black p-10 ${fontClass} leading-relaxed text-[13px] print:p-0 print:m-0`}>
      {/* Header */}
      <header className="text-center mb-6">
        {personalInfo.imageUrl && (
          <div className="flex justify-center mb-3 print:hidden">
            <img
              src={personalInfo.imageUrl}
              alt={personalInfo.fullName}
              className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow-sm"
            />
          </div>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
          {personalInfo.fullName}
        </h1>
        <p className="text-sm font-medium text-gray-700 tracking-wide mt-1">
          {personalInfo.title}
        </p>
        
        {/* Contact Info */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-600 mt-2 text-[11px] font-normal">
          <span>{personalInfo.location}</span>
          <span>•</span>
          <span>{personalInfo.phone}</span>
          <span>•</span>
          <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
          
          {personalInfo.website && (
            <>
              <span>•</span>
              <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">
                {personalInfo.website.replace(/^https?:\/\//, '')}
              </a>
            </>
          )}
          {personalInfo.linkedin && (
            <>
              <span>•</span>
              <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">
                {personalInfo.linkedin}
              </a>
            </>
          )}
          {personalInfo.github && (
            <>
              <span>•</span>
              <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline">
                {personalInfo.github}
              </a>
            </>
          )}
        </div>
      </header>

      {/* Summary always goes first under header */}
      {renderSummary()}

      {/* Render sections in strict sectionOrder sequence */}
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
  )
}
