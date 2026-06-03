import { useState, useEffect } from 'react'
import ResourceCard from '../components/ResourceCard'
import AddResourceModal from '../components/AddResourceModal'
import { fetchResources, addResource, toggleResource, deleteResource } from '../lib/db'
import { AREAS, AREA_COLORS } from '../types'
import type { Resource, Area } from '../types'

export default function Library() {
  const [resources, setResources] = useState<Resource[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [areaFilter, setAreaFilter] = useState<Area | ''>('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      const data = await fetchResources()
      setResources(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar recursos')
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (data: { name: string; url: string | null; image_url: string | null; areas: Area[]; skills: string[] }) => {
    try {
      setError(null)
      await addResource({ ...data, status: 'pending' })
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao adicionar recurso')
    }
  }

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      setError(null)
      await toggleResource(id, completed)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao atualizar recurso')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setError(null)
      await deleteResource(id)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao excluir recurso')
    }
  }

  const filtered = resources.filter((r) => {
    if (statusFilter === 'pending' && r.status !== 'pending') return false
    if (statusFilter === 'completed' && r.status !== 'completed') return false
    if (areaFilter && !r.areas.includes(areaFilter)) return false
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

      <div className="flex flex-col gap-3 mb-6">
        <div className="flex gap-3">
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['all', 'pending', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  statusFilter === f
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

        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setAreaFilter('')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              areaFilter === ''
                ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Todas áreas
          </button>
          {AREAS.map((area) => (
            <button
              key={area}
              onClick={() => setAreaFilter(areaFilter === area ? '' : area)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                areaFilter === area
                  ? 'text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              style={{
                backgroundColor: areaFilter === area ? AREA_COLORS[area] : undefined,
              }}
            >
              {area}
            </button>
          ))}
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
          {search || areaFilter ? 'Nenhum recurso encontrado.' : 'Nenhum recurso ainda. Adicione o primeiro!'}
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
