import { useState, useEffect } from 'react'
import AddSkillModal from '../components/AddSkillModal'
import { fetchSkills, addSkill, updateSkill, deleteSkill } from '../lib/db'
import { AREAS, AREA_COLORS, SKILL_STATUS, SKILL_STATUS_ORDER } from '../types'
import type { Skill, Area, SkillStatus } from '../types'

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    try {
      const data = await fetchSkills()
      setSkills(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar habilidades')
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (data: { name: string; area: Area }) => {
    try {
      setError(null)
      const areaSkills = skills.filter((s) => s.area === data.area)
      await addSkill({
        ...data,
        status: 'to_learn',
        order: areaSkills.length,
      })
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao adicionar habilidade')
    }
  }

  const cycleStatus = (skill: Skill) => {
    const idx = SKILL_STATUS_ORDER.indexOf(skill.status)
    const next = SKILL_STATUS_ORDER[(idx + 1) % SKILL_STATUS_ORDER.length]
    handleUpdate(skill.id, { status: next })
  }

  const handleUpdate = async (id: string, updates: Partial<Skill>) => {
    try {
      setError(null)
      await updateSkill(id, updates)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao atualizar habilidade')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setError(null)
      await deleteSkill(id)
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao excluir habilidade')
    }
  }

  const moveSkill = async (skill: Skill, direction: -1 | 1) => {
    const areaSkills = skills
      .filter((s) => s.area === skill.area)
      .sort((a, b) => a.order - b.order)
    const idx = areaSkills.findIndex((s) => s.id === skill.id)
    const target = idx + direction
    if (target < 0 || target >= areaSkills.length) return

    const other = areaSkills[target]
    const updates = [
      { id: skill.id, order: other.order },
      { id: other.id, order: skill.order },
    ]
    try {
      setError(null)
      for (const { id, order } of updates) {
        await updateSkill(id, { order } as Partial<Skill>)
      }
      load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao reordenar')
    }
  }

  const grouped = AREAS.map((area) => ({
    area,
    skills: skills
      .filter((s) => s.area === area)
      .sort((a, b) => a.order - b.order),
  }))

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Carregando...</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">🗺️ Roadmap</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {skills.length} habilidade{skills.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          + Nova Skill
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {grouped
        .filter((g) => g.skills.length > 0)
        .map(({ area, skills: areaSkills }) => {
          const total = areaSkills.length
          const learned = areaSkills.filter((s) => s.status === 'learned').length
          const pct = total > 0 ? Math.round((learned / total) * 100) : 0

          return (
            <div key={area} className="mb-10">
              <div className="flex items-center gap-3 mb-3">
                <h2
                  className="text-sm font-bold px-3 py-1 rounded text-white"
                  style={{ backgroundColor: AREA_COLORS[area] }}
                >
                  {area}
                </h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {learned}/{total} · {pct}%
                </span>
              </div>

              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 mb-4 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: AREA_COLORS[area],
                  }}
                />
              </div>

              <div className="flex items-start gap-0 overflow-x-auto pb-2">
                {areaSkills.map((skill, idx) => (
                  <div key={skill.id} className="flex items-center shrink-0">
                    {idx > 0 && (
                      <div className="w-4 h-0.5 bg-gray-300 dark:bg-gray-600 shrink-0" />
                    )}
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => cycleStatus(skill)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border-2 cursor-pointer whitespace-nowrap ${
                          skill.status === 'learned'
                            ? 'border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'
                            : skill.status === 'learning'
                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300'
                            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                        }`}
                        title="Clique para alternar status"
                      >
                        {SKILL_STATUS[skill.status]} {skill.name}
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveSkill(skill, -1)}
                          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer disabled:opacity-20"
                          disabled={idx === 0}
                        >
                          ◀
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="text-xs text-red-400 hover:text-red-600 cursor-pointer"
                        >
                          ✕
                        </button>
                        <button
                          onClick={() => moveSkill(skill, 1)}
                          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer disabled:opacity-20"
                          disabled={idx === areaSkills.length - 1}
                        >
                          ▶
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

      {!loading && skills.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          Nenhuma habilidade ainda. Adicione a primeira!
        </div>
      )}

      <AddSkillModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
    </div>
  )
}
