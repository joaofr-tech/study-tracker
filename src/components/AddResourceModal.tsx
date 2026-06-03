import { useState } from 'react'
import { AREAS, AREA_COLORS, type Area } from '../types'

interface AddResourceModalProps {
  open: boolean
  onClose: () => void
  onAdd: (data: { name: string; url: string | null; image_url: string | null; areas: Area[]; skills: string[] }) => void
}

export default function AddResourceModal({ open, onClose, onAdd }: AddResourceModalProps) {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [selectedAreas, setSelectedAreas] = useState<Area[]>([])
  const [skillsInput, setSkillsInput] = useState('')

  if (!open) return null

  const toggleArea = (area: Area) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd({
      name: name.trim(),
      url: url.trim() || null,
      image_url: imageUrl.trim() || null,
      areas: selectedAreas,
      skills: skillsInput.split(',').map((s) => s.trim()).filter(Boolean),
    })
    setName('')
    setUrl('')
    setImageUrl('')
    setSelectedAreas([])
    setSkillsInput('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-800 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Novo Recurso</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: Curso Docker Completo"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Link do curso ou vídeo</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Imagem opcional</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Deixe vazio para gerar automaticamente"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Áreas relacionadas</label>
            <div className="flex flex-wrap gap-2">
              {AREAS.map((area) => {
                const selected = selectedAreas.includes(area)
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleArea(area)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all cursor-pointer ${
                      selected
                        ? 'text-white border-transparent'
                        : 'bg-transparent border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                    }`}
                    style={{
                      backgroundColor: selected ? AREA_COLORS[area] : undefined,
                      borderColor: selected ? AREA_COLORS[area] : undefined,
                    }}
                  >
                    {area}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Skills adquiridas (separadas por vírgula)</label>
            <input
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Docker Compose, Dockerfile"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
