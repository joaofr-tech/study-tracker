import { useState, useEffect } from 'react'
import ResourceCard from '../components/ResourceCard'
import { fetchResources, toggleResource, deleteResource } from '../lib/db'
import type { Resource } from '../types'

export default function Completed() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      const data = await fetchResources()
      setResources(data.filter((r) => r.status === 'completed'))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar recursos')
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">✅ Completo</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          {resources.length} recurso{resources.length !== 1 ? 's' : ''} concluído{resources.length !== 1 ? 's' : ''}
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-500">Carregando...</div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Nenhum recurso concluído ainda. Continue estudando! 🚀
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((r) => (
            <ResourceCard key={r.id} resource={r} onToggle={handleToggle} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
