import { ResumeContent } from '@/types/resume'

export const mockResumeData: ResumeContent = {
  personalInfo: {
    fullName: 'Alejandro Sanz Pérez',
    title: 'Ingeniero de Software Senior / Fullstack',
    email: 'alejandro.sanz@email.com',
    phone: '+34 612 345 678',
    location: 'Madrid, España',
    website: 'https://alejandrosanz.dev',
    linkedin: 'linkedin.com/in/alejandrosanz',
    github: 'github.com/alejandrosanz'
  },
  summary: 'Ingeniero de Software Fullstack con más de 6 años de experiencia diseñando, desarrollando y desplegando aplicaciones web escalables y de alto rendimiento. Especializado en arquitectura con React, Next.js, Node.js y bases de datos SQL/NoSQL. Apasionado por la optimización de código, automatización y la creación de interfaces intuitivas y accesibles.',
  experience: [
    {
      id: 'exp-1',
      company: 'Tech Solutions Global',
      role: 'Senior Fullstack Engineer',
      startDate: '2023-01',
      endDate: 'Presente',
      current: true,
      description: '• Lideré el rediseño de la plataforma SaaS principal utilizando Next.js App Router y TypeScript, reduciendo el tiempo de carga en un 40%.\n• Diseñé e implementé API RESTful escalables con Node.js y Express, optimizando consultas PostgreSQL que procesan 1.5M de registros diarios.\n• Supervisé y guié a un equipo de 4 ingenieros junior, promoviendo revisiones de código exhaustivas y buenas prácticas de desarrollo ágil.\n• Implementé pipelines de CI/CD robustos mediante GitHub Actions, reduciendo los fallos en despliegues en un 25%.'
    },
    {
      id: 'exp-2',
      company: 'Innovación Digital S.A.',
      role: 'Fullstack Developer',
      startDate: '2020-03',
      endDate: '2022-12',
      current: false,
      description: '• Desarrollé e integré múltiples módulos interactivos utilizando React.js y Tailwind CSS, garantizando total adaptabilidad móvil.\n• Integré sistemas de pagos seguros mediante Stripe y flujos de autenticación OAuth 2.0 y JWT.\n• Migré sistemas monolíticos heredados a arquitecturas modernas de microservicios alojados en AWS (Lambda, ECS, S3).\n• Colaboré estrechamente con diseñadores UX/UI para dar vida a interfaces complejas con fidelidad absoluta al diseño original.'
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Universidad Politécnica de Madrid',
      degree: 'Grado en Ingeniería Informática',
      fieldOfStudy: 'Sistemas de Información y Desarrollo de Software',
      startDate: '2015-09',
      endDate: '2019-06',
      description: 'Especialización en desarrollo de software y bases de datos relacionales. Graduado con honores en el proyecto final de carrera.'
    }
  ],
  skills: [
    {
      category: 'Lenguajes de Programación',
      items: ['TypeScript', 'JavaScript (ES6+)', 'Node.js', 'Python', 'SQL', 'HTML5/CSS3']
    },
    {
      category: 'Frameworks y Tecnologías',
      items: ['React.js', 'Next.js', 'Express.js', 'Tailwind CSS', 'Supabase', 'Redux Toolkit']
    },
    {
      category: 'Herramientas y DevOps',
      items: ['Git & GitHub', 'Docker', 'Amazon Web Services (AWS)', 'CI/CD (GitHub Actions)', 'PostgreSQL', 'Jest']
    }
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Plataforma E-Commerce en Tiempo Real',
      description: 'Desarrollé una aplicación de comercio electrónico escalable con actualizaciones de stock en tiempo real mediante WebSockets, pasarela de pago Stripe y panel de control analítico integrado.',
      url: 'https://github.com/alejandrosanz/realtime-shop',
      technologies: ['Next.js', 'Tailwind CSS', 'Supabase', 'Stripe']
    },
    {
      id: 'proj-2',
      name: 'Gestor de Tareas Colaborativo',
      description: 'Aplicación SaaS tipo Kanban multitenant para la gestión y asignación de tareas a nivel corporativo, con actualizaciones en vivo y soporte offline.',
      url: 'https://github.com/alejandrosanz/task-flow',
      technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB']
    }
  ],
  languages: [
    {
      name: 'Español',
      level: 'Nativo'
    },
    {
      name: 'Inglés',
      level: 'Profesional (C1)'
    }
  ]
}
