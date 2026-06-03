import { useState, useEffect } from 'react'
import IdeaCard from '../components/IdeaCard'
import AddIdeaModal from '../components/AddIdeaModal'
import { fetchIdeas, addIdea, updateIdea, deleteIdea } from '../lib/db'
import { IDEA_STATUS } from '../types'
import type { ProjectIdea, IdeaStatus } from '../types'

export default function Ideas() {
  const [ideas, setIdeas] = useState<ProjectIdea[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<IdeaStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      const data = await fetchIdeas()
      setIdeas(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar ideias')
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (data: { title: string; description: string }) => {
    try {
      setError(null)
      await addIdea({
        ...data,
        problem: null,
        solution: null,
        technologies: null,
        next_step: null,
        status: 'idea',
        complexity: 1,
        repo_url: null,
      })
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao adicionar ideia')
    }
  }

  const handleUpdate = async (id: string, updates: Partial<ProjectIdea>) => {
    try {
      setError(null)
      await updateIdea(id, updates)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao atualizar ideia')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setError(null)
      await deleteIdea(id)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao excluir ideia')
    }
  }

  const filtered = ideas.filter((idea) => {
    if (statusFilter !== 'all' && idea.status !== statusFilter) return false
    if (search && !idea.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">💡 Ideias</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {ideas.length} ideias
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors self-start cursor-pointer"
        >
          + Nova Ideia
        </button>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex gap-3">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Todas
            </button>
            {(Object.entries(IDEA_STATUS) as [IdeaStatus, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === key
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            placeholder="Buscar ideia..."
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-500">Carregando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          {search || statusFilter !== 'all' ? 'Nenhuma ideia encontrada.' : 'Nenhuma ideia ainda. Capture a primeira!'}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} onUpdate={handleUpdate} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <AddIdeaModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
    </div>
  )
}
