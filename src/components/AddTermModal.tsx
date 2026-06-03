import { useState } from 'react'
import { AREAS, AREA_COLORS, type Area } from '../types'

interface AddTermModalProps {
  open: boolean
  onClose: () => void
  onAdd: (data: { term: string; areas: Area[] }) => void
}

export default function AddTermModal({ open, onClose, onAdd }: AddTermModalProps) {
  const [term, setTerm] = useState('')
  const [selectedAreas, setSelectedAreas] = useState<Area[]>([])

  if (!open) return null

  const toggleArea = (area: Area) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!term.trim()) return
    onAdd({ term: term.trim(), areas: selectedAreas })
    setTerm('')
    setSelectedAreas([])
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-800 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Novo Termo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Termo</label>
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: Race Condition"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Áreas (opcional)</label>
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
