import { useState } from 'react'

interface AddIdeaModalProps {
  open: boolean
  onClose: () => void
  onAdd: (data: { title: string; description: string }) => void
}

export default function AddIdeaModal({ open, onClose, onAdd }: AddIdeaModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title: title.trim(), description: description.trim() })
    setTitle('')
    setDescription('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-800 shadow-xl">
        <h2 className="text-xl font-bold mb-4">💡 Nova Ideia</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome do projeto</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ex: App de Inglês com IA"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descrição rápida</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="O que você quer fazer? (1-2 frases)"
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
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
