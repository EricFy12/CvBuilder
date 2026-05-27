export interface PersonalInfo {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  website?: string
  linkedin?: string
  github?: string
  imageUrl?: string
}

export interface WorkExperience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate: string
  description?: string
}

export interface SkillCategory {
  category: string
  items: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  url?: string
  technologies?: string[]
}

export interface Language {
  name: string
  level: string
}

export interface ResumeContent {
  personalInfo: PersonalInfo
  summary: string
  experience: WorkExperience[]
  education: Education[]
  skills: SkillCategory[]
  projects?: Project[]
  languages?: Language[]
  sectionOrder?: string[]
  isCompact?: boolean
  skillsDisplayMode?: 'tags' | 'inline'
  avatarPosition?: 'top' | 'side'
  fontSize?: 'sm' | 'md' | 'lg'
}

export interface Resume {
  id: string
  user_id?: string
  title: string
  content: ResumeContent
  template_id: string
  created_at?: string
  updated_at?: string
}
