import { useState, useEffect } from 'react'
import AddPlatformModal from '../components/AddPlatformModal'
import { fetchPlatforms, addPlatform, deletePlatform } from '../lib/db'
import type { Platform } from '../types'

export default function Platforms() {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const data = await fetchPlatforms()
    setPlatforms(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (data: { name: string; url: string; description: string }) => {
    await addPlatform(data)
    load()
  }

  const handleDelete = async (id: string) => {
    await deletePlatform(id)
    load()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">🔧 Platforms</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Plataformas de estudo como Kaggle, Hugging Face, etc.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          + Nova Plataforma
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Carregando...</div>
      ) : platforms.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Nenhuma plataforma cadastrada.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {platforms.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all bg-white dark:bg-gray-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{p.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{p.description}</p>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400">{p.url}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleDelete(p.id)
                  }}
                  className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  ✕
                </button>
              </div>
            </a>
          ))}
        </div>
      )}

      <AddPlatformModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
    </div>
  )
}
