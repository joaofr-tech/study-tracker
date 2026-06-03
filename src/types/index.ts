export const AREAS = [
  'Back-end',
  'Front-end',
  'Cloud',
  'DevOps',
  'Arquitetura',
  'Testes',
  'Segurança',
] as const

export type Area = (typeof AREAS)[number]

export const AREA_COLORS: Record<Area, string> = {
  'Back-end': '#6366f1',
  'Front-end': '#f59e0b',
  Cloud: '#3b82f6',
  DevOps: '#10b981',
  Arquitetura: '#8b5cf6',
  Testes: '#ef4444',
  Segurança: '#06b6d4',
}

export interface Resource {
  id: string
  name: string
  url?: string | null
  image_url?: string | null
  areas: Area[]
  skills: string[]
  status: 'pending' | 'completed'
  created_at: string
  completed_at: string | null
}

export interface Platform {
  id: string
  name: string
  url: string
  description: string
}

export interface GlossaryEntry {
  id: string
  term: string
  definition: string
  areas: Area[]
  pinned: boolean
  created_at: string
}
