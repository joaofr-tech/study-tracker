import { hasSupabaseConfig, supabase } from './supabase'
import type { Resource, Platform, GlossaryEntry } from '../types'

const useMock = !hasSupabaseConfig

const STORAGE_KEY_R = 'study-tracker-resources'
const STORAGE_KEY_P = 'study-tracker-platforms'
const STORAGE_KEY_G = 'study-tracker-glossary'

function loadFromStorage<T>(key: string): T[] {
  if (!useMock) return []
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T[]
  } catch {}
  return []
}

function saveToStorage(key: string, data: unknown) {
  if (!useMock) return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch {}
}

let localResources: Resource[] = loadFromStorage(STORAGE_KEY_R)
let localPlatforms: Platform[] = loadFromStorage(STORAGE_KEY_P)
let localGlossary: GlossaryEntry[] = loadFromStorage(STORAGE_KEY_G)

function genId() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11)
}

function getSupabase() {
  if (!supabase) {
    throw new Error('Supabase is not configured')
  }
  return supabase
}

export async function fetchResources(): Promise<Resource[]> {
  if (useMock) return [...localResources]
  const { data, error } = await getSupabase().from('resources').select('*').order('created_at', { ascending: false })
  if (error) { throw new Error(error.message) }
  return (data as Resource[]) || []
}

export async function fetchPlatforms(): Promise<Platform[]> {
  if (useMock) return [...localPlatforms]
  const { data, error } = await getSupabase().from('platforms').select('*').order('name')
  if (error) { throw new Error(error.message) }
  return (data as Platform[]) || []
}

export async function addResource(resource: Omit<Resource, 'id' | 'created_at' | 'completed_at'>) {
  if (useMock) {
    const newResource: Resource = {
      ...resource,
      id: genId(),
      created_at: new Date().toISOString(),
      completed_at: null,
    }
    localResources = [newResource, ...localResources]
    saveToStorage(STORAGE_KEY_R, localResources)
    return newResource
  }
  const { data, error } = await getSupabase().from('resources').insert(resource).select().single()
  if (error) { console.error('addResource:', error.message); throw new Error(error.message) }
  return data as Resource | null
}

export async function toggleResource(id: string, completed: boolean) {
  if (useMock) {
    localResources = localResources.map((r) =>
      r.id === id
        ? {
            ...r,
            status: completed ? 'completed' : 'pending',
            completed_at: completed ? new Date().toISOString() : null,
          }
        : r
    )
    saveToStorage(STORAGE_KEY_R, localResources)
    return localResources.find((r) => r.id === id) || null
  }
  const updates: Partial<Resource> = {
    status: completed ? 'completed' : 'pending',
    completed_at: completed ? new Date().toISOString() : null,
  }
  const { data, error } = await getSupabase().from('resources').update(updates).eq('id', id).select().single()
  if (error) { throw new Error(error.message) }
  return data as Resource | null
}

export async function deleteResource(id: string) {
  if (useMock) {
    localResources = localResources.filter((r) => r.id !== id)
    saveToStorage(STORAGE_KEY_R, localResources)
    return
  }
  const { error } = await getSupabase().from('resources').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function addPlatform(platform: Omit<Platform, 'id'>) {
  if (useMock) {
    const newPlatform: Platform = { ...platform, id: genId() }
    localPlatforms = [...localPlatforms, newPlatform]
    saveToStorage(STORAGE_KEY_P, localPlatforms)
    return newPlatform
  }
  const { data, error } = await getSupabase().from('platforms').insert(platform).select().single()
  if (error) { console.error('addPlatform:', error.message); throw new Error(error.message) }
  return data as Platform | null
}

export async function deletePlatform(id: string) {
  if (useMock) {
    localPlatforms = localPlatforms.filter((p) => p.id !== id)
    saveToStorage(STORAGE_KEY_P, localPlatforms)
    return
  }
  const { error } = await getSupabase().from('platforms').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function fetchGlossary(): Promise<GlossaryEntry[]> {
  if (useMock) return [...localGlossary]
  const { data, error } = await getSupabase().from('glossary').select('*').order('term', { ascending: true })
  if (error) { throw new Error(error.message) }
  return (data as GlossaryEntry[]) || []
}

export async function addTerm(entry: Omit<GlossaryEntry, 'id' | 'created_at'>) {
  if (useMock) {
    const newEntry: GlossaryEntry = {
      ...entry,
      id: genId(),
      created_at: new Date().toISOString(),
    }
    localGlossary = [...localGlossary, newEntry]
    saveToStorage(STORAGE_KEY_G, localGlossary)
    return newEntry
  }
  const { data, error } = await getSupabase().from('glossary').insert(entry).select().single()
  if (error) { console.error('addTerm:', error.message); throw new Error(error.message) }
  return data as GlossaryEntry | null
}

export async function updateTerm(id: string, updates: Partial<GlossaryEntry>) {
  if (useMock) {
    localGlossary = localGlossary.map((e) => (e.id === id ? { ...e, ...updates } : e))
    saveToStorage(STORAGE_KEY_G, localGlossary)
    return localGlossary.find((e) => e.id === id) || null
  }
  const { data, error } = await getSupabase().from('glossary').update(updates).eq('id', id).select().single()
  if (error) { throw new Error(error.message) }
  return data as GlossaryEntry | null
}

export async function deleteTerm(id: string) {
  if (useMock) {
    localGlossary = localGlossary.filter((e) => e.id !== id)
    saveToStorage(STORAGE_KEY_G, localGlossary)
    return
  }
  const { error } = await getSupabase().from('glossary').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
