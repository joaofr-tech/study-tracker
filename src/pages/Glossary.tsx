import { useState, useEffect, useMemo } from 'react'
import GlossaryCard from '../components/GlossaryCard'
import AddTermModal from '../components/AddTermModal'
import { fetchGlossary, addTerm, updateTerm, deleteTerm } from '../lib/db'
import { AREAS, AREA_COLORS } from '../types'
import type { GlossaryEntry, Area } from '../types'

export default function Glossary() {
  const [entries, setEntries] = useState<GlossaryEntry[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [areaFilter, setAreaFilter] = useState<Area | ''>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      const data = await fetchGlossary()
      setEntries(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar glossário')
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (data: { term: string; areas: Area[] }) => {
    try {
      setError(null)
      await addTerm({ ...data, definition: '', pinned: false })
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao adicionar termo')
    }
  }

  const handleUpdate = async (id: string, updates: Partial<GlossaryEntry>) => {
    try {
      setError(null)
      await updateTerm(id, updates)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao atualizar termo')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setError(null)
      await deleteTerm(id)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao excluir termo')
    }
  }

  const filtered = useMemo(() => {
    let result = entries.filter((e) => {
      if (search && !e.term.toLowerCase().includes(search.toLowerCase())) return false
      if (areaFilter && !e.areas.includes(areaFilter)) return false
      return true
    })

    const pinned = result.filter((e) => e.pinned)
    const unpinned = result.filter((e) => !e.pinned)
    unpinned.sort((a, b) => a.term.localeCompare(b.term, 'pt-BR'))

    return { pinned, unpinned }
  }, [entries, search, areaFilter])

  const grouped = useMemo(() => {
    const groups: Record<string, GlossaryEntry[]> = {}
    filtered.unpinned.forEach((e) => {
      const letter = e.term[0].toUpperCase()
      if (!groups[letter]) groups[letter] = []
      groups[letter].push(e)
    })
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">📖 Glossário</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {entries.length} termo{entries.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors self-start cursor-pointer"
        >
          + Novo Termo
        </button>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          placeholder="Buscar termo..."
        />
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
      ) : entries.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Nenhum termo ainda. Adicione o primeiro!
        </div>
      ) : filtered.pinned.length === 0 && filtered.unpinned.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Nenhum termo encontrado.
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.pinned.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                📌 Fixados
              </h2>
              <div className="space-y-2">
                {filtered.pinned.map((entry) => (
                  <GlossaryCard
                    key={entry.id}
                    entry={entry}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {grouped.map(([letter, items]) => (
            <div key={letter}>
              <h2 className="text-lg font-bold text-gray-400 dark:text-gray-500 mb-2">
                {letter}
              </h2>
              <div className="space-y-2">
                {items.map((entry) => (
                  <GlossaryCard
                    key={entry.id}
                    entry={entry}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddTermModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
    </div>
  )
}
