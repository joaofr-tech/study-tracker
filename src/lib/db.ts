import { supabase } from './supabase'
import type { Resource, Platform } from '../types'

export async function fetchResources(): Promise<Resource[]> {
  const { data } = await supabase.from('resources').select('*').order('created_at', { ascending: false })
  return (data as Resource[]) || []
}

export async function fetchPlatforms(): Promise<Platform[]> {
  const { data } = await supabase.from('platforms').select('*').order('name')
  return (data as Platform[]) || []
}

export async function addResource(resource: Omit<Resource, 'id' | 'created_at' | 'completed_at'>) {
  const { data } = await supabase.from('resources').insert(resource).select().single()
  return data as Resource | null
}

export async function toggleResource(id: string, completed: boolean) {
  const updates: Partial<Resource> = {
    status: completed ? 'completed' : 'pending',
    progress: completed ? 100 : 0,
    completed_at: completed ? new Date().toISOString() : null,
  }
  const { data } = await supabase.from('resources').update(updates).eq('id', id).select().single()
  return data as Resource | null
}

export async function updateResourceProgress(id: string, progress: number) {
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
  await supabase.from('resources').delete().eq('id', id)
}

export async function addPlatform(platform: Omit<Platform, 'id'>) {
  const { data } = await supabase.from('platforms').insert(platform).select().single()
  return data as Platform | null
}

export async function deletePlatform(id: string) {
  await supabase.from('platforms').delete().eq('id', id)
}
