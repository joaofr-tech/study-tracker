import type { Resource } from '../types'

function getYouTubeVideoId(url: string) {
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.replace(/^www\./, '')

    if (hostname === 'youtu.be') {
      return parsed.pathname.split('/').filter(Boolean)[0]
    }

    if (hostname === 'youtube.com' || hostname === 'm.youtube.com') {
      if (parsed.pathname === '/watch') return parsed.searchParams.get('v')

      const [, route, id] = parsed.pathname.split('/')
      if (route === 'embed' || route === 'shorts') return id
    }
  } catch {
    return null
  }

  return null
}

export function getResourceImageUrl(resource: Resource) {
  if (resource.image_url) return resource.image_url

  if (resource.url) {
    const youtubeId = getYouTubeVideoId(resource.url)
    if (youtubeId) return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
  }

  return getGeneratedResourceImageUrl(resource)
}

export function getGeneratedResourceImageUrl(resource: Resource) {
  const seed = encodeURIComponent(resource.name.trim() || resource.id)
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${seed}&backgroundColor=eff6ff,f0fdf4,fef3c7,fce7f3,e0f2fe`
}
