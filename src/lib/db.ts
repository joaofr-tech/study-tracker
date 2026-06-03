import { supabase } from './supabase'
import { mockResources, mockPlatforms } from '../data/mock'
import type { Resource, Platform } from '../types'

const useMock = !import.meta.env.VITE_SUPABASE_URL

let localResources = [...mockResources]
let localPlatforms = [...mockPlatforms]

function genId() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 11)
}

export async function fetchResources(): Promise<Resource[]> {
  if (useMock) return [...localResources]
  const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false })
  return (data as Resource[]) || []
}

export async function fetchPlatforms(): Promise<Platform[]> {
  if (useMock) return [...localPlatforms]
  const { data } = await supabase.from('platforms').select('*').order('name')
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
    return newResource
  }
  const { data } = await supabase.from('resources').insert(resource).select().single()
  return data as Resource | null
}

export async function toggleResource(id: string, completed: boolean) {
  if (useMock) {
    localResources = localResources.map((r) =>
      r.id === id
        ? {
            ...r,
            status: completed ? 'completed' : 'pending',
            progress: completed ? 100 : 0,
            completed_at: completed ? new Date().toISOString() : null,
          }
        : r
    )
    return localResources.find((r) => r.id === id) || null
  }
  const updates: Partial<Resource> = {
    status: completed ? 'completed' : 'pending',
    progress: completed ? 100 : 0,
    completed_at: completed ? new Date().toISOString() : null,
  }
  const { data } = await supabase.from('resources').update(updates).eq('id', id).select().single()
  return data as Resource | null
}

export async function updateResourceProgress(id: string, progress: number) {
  if (useMock) {
    const status = progress >= 100 ? 'completed' : 'pending'
    localResources = localResources.map((r) =>
      r.id === id
        ? {
            ...r,
            progress,
            status,
            completed_at: progress >= 100 ? new Date().toISOString() : null,
          }
        : r
    )
    return localResources.find((r) => r.id === id) || null
  }
  const status = progress >= 100 ? 'completed' : 'pending'
  const updates: Partial<Resource> = {
    progress,
    status,
    completed_at: progress >= 100 ? new Date().toISOString() : null,
  }
  const { data } = await supabase.from('resources').update(updates).eq('id', id).select().single()
  return data as Resource | null
}

export async function deleteResource(id: string) {
  if (useMock) {
    localResources = localResources.filter((r) => r.id !== id)
    return
  }
  await supabase.from('resources').delete().eq('id', id)
}

export async function addPlatform(platform: Omit<Platform, 'id'>) {
  if (useMock) {
    const newPlatform: Platform = { ...platform, id: genId() }
    localPlatforms = [...localPlatforms, newPlatform]
    return newPlatform
  }
  const { data } = await supabase.from('platforms').insert(platform).select().single()
  return data as Platform | null
}

export async function deletePlatform(id: string) {
  if (useMock) {
    localPlatforms = localPlatforms.filter((p) => p.id !== id)
    return
  }
  await supabase.from('platforms').delete().eq('id', id)
}
