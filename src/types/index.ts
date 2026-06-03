export interface Resource {
  id: string
  name: string
  url?: string | null
  image_url?: string | null
  tags: string[]
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
