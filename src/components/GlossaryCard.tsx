import { useState, useRef, useEffect } from 'react'
import { AREA_COLORS } from '../types'
import type { GlossaryEntry, Area } from '../types'

interface GlossaryCardProps {
  entry: GlossaryEntry
  onUpdate: (id: string, updates: Partial<GlossaryEntry>) => void
  onDelete: (id: string) => void
}

export default function GlossaryCard({ entry, onUpdate, onDelete }: GlossaryCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [editingDef, setEditingDef] = useState(false)
  const [defText, setDefText] = useState(entry.definition)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editingDef && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [editingDef])

  const saveDef = () => {
    onUpdate(entry.id, { definition: defText.trim() })
    setEditingDef(false)
  }

  const togglePin = () => {
    onUpdate(entry.id, { pinned: !entry.pinned })
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 transition-shadow hover:shadow-sm">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-left flex-1 cursor-pointer"
          >
            <span className="text-sm text-gray-400 transition-transform" style={{ transform: expanded ? 'rotate(90deg)' : undefined }}>
              ▶
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${entry.pinned ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                  {entry.term}
                </span>
                {entry.pinned && <span className="text-xs">📌</span>}
              </div>
              {entry.areas.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {entry.areas.map((area) => (
                    <span
                      key={area}
                      className="px-1.5 py-0.5 text-[10px] rounded text-white font-medium"
                      style={{ backgroundColor: AREA_COLORS[area as Area] || '#6b7280' }}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </button>

          <div className="flex gap-1 shrink-0">
            <button
              onClick={togglePin}
              className={`px-2 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                entry.pinned
                  ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title={entry.pinned ? 'Desafixar' : 'Fixar'}
            >
              📌
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            {editingDef ? (
              <div>
                <textarea
                  ref={textareaRef}
                  value={defText}
                  onChange={(e) => setDefText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                  rows={3}
                  placeholder="O que esse termo significa?"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={saveDef}
                    className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => { setDefText(entry.definition); setEditingDef(false) }}
                    className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                {entry.definition ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {entry.definition}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    Nenhuma definição ainda.
                  </p>
                )}
                <button
                  onClick={() => setEditingDef(true)}
                  className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  {entry.definition ? 'Editar definição' : 'Adicionar definição'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
