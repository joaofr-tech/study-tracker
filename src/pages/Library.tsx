import { useState, useEffect } from 'react'
import ResourceCard from '../components/ResourceCard'
import AddResourceModal from '../components/AddResourceModal'
import { fetchResources, addResource, toggleResource, deleteResource } from '../lib/db'
import type { Resource } from '../types'

export default function Library() {
  const [resources, setResources] = useState<Resource[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const data = await fetchResources()
    setResources(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (data: { name: string; url: string | null; image_url: string | null; tags: string[]; skills: string[] }) => {
    await addResource({ ...data, status: 'pending' })
    load()
  }

  const handleToggle = async (id: string, completed: boolean) => {
    await toggleResource(id, completed)
    load()
  }

  const handleDelete = async (id: string) => {
    await deleteResource(id)
    load()
  }

  const filtered = resources.filter((r) => {
    if (filter === 'pending' && r.status !== 'pending') return false
    if (filter === 'completed' && r.status !== 'completed') return false
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const pendingCount = resources.filter((r) => r.status === 'pending').length
  const completedCount = resources.filter((r) => r.status === 'completed').length

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">🎓 Acervo</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {pendingCount} pendentes • {completedCount} concluídos
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors self-start cursor-pointer"
        >
          + Novo Recurso
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendentes' : 'Concluídas'}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          placeholder="Buscar recurso..."
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Carregando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          {search ? 'Nenhum recurso encontrado.' : 'Nenhum recurso ainda. Adicione o primeiro!'}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <ResourceCard key={r.id} resource={r} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <AddResourceModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
    </div>
  )
}
