export interface Resource {
  id: string
  name: string
  tags: string[]
  skills: string[]
  xp: number
  status: 'pending' | 'completed'
  progress: number
  created_at: string
  completed_at: string | null
}

export interface Platform {
  id: string
  name: string
  url: string
  description: string
}

export const LEVELS = [
  { level: 1, name: 'Novato', xp_needed: 0 },
  { level: 2, name: 'Iniciante', xp_needed: 100 },
  { level: 3, name: 'Aprendiz', xp_needed: 300 },
  { level: 4, name: 'Dedicado', xp_needed: 600 },
  { level: 5, name: 'Estudante', xp_needed: 1000 },
  { level: 6, name: 'Persistente', xp_needed: 1500 },
  { level: 7, name: 'Esforçado', xp_needed: 2100 },
  { level: 8, name: 'Determinado', xp_needed: 2800 },
  { level: 9, name: 'Focado', xp_needed: 3600 },
  { level: 10, name: 'Engenheiro', xp_needed: 4500 },
  { level: 15, name: 'Expert', xp_needed: 8000 },
  { level: 20, name: 'Mestre', xp_needed: 15000 },
  { level: 30, name: 'Especialista', xp_needed: 30000 },
  { level: 40, name: 'Arquiteto', xp_needed: 50000 },
  { level: 50, name: 'Lendário', xp_needed: 80000 },
]

export function getLevel(totalXp: number): { level: number; name: string; xp_needed: number; prev_xp: number } {
  let current = LEVELS[0]
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVELS[i].xp_needed) {
      current = LEVELS[i]
      break
    }
  }
  const idx = LEVELS.indexOf(current)
  const next = LEVELS[idx + 1]
  return {
    level: current.level,
    name: current.name,
    xp_needed: next ? next.xp_needed : current.xp_needed,
    prev_xp: current.xp_needed,
  }
}
