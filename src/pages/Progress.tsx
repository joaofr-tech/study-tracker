import { useState, useEffect } from 'react'
import { fetchResources } from '../lib/db'
import { getLevel } from '../types'
import type { Resource } from '../types'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'

const SKILL_CATEGORIES = ['Cloud', 'Backend', 'Frontend', 'DevOps', 'Data', 'Security']

function categorizeSkill(skill: string): string {
  const lower = skill.toLowerCase()
  if (['aws', 's3', 'sqs', 'cloud', 'azure', 'gcp'].some((k) => lower.includes(k))) return 'Cloud'
  if (['node', 'python', 'java', 'api', 'rest', 'graphql', 'backend', 'server'].some((k) => lower.includes(k))) return 'Backend'
  if (['react', 'vue', 'angular', 'css', 'html', 'frontend', 'ui', 'ux'].some((k) => lower.includes(k))) return 'Frontend'
  if (['docker', 'kubernetes', 'ci/cd', 'devops', 'terraform', 'deploy'].some((k) => lower.includes(k))) return 'DevOps'
  if (['data', 'sql', 'database', 'python', 'pandas', 'analytics', 'ml', 'ai'].some((k) => lower.includes(k))) return 'Data'
  if (['jwt', 'oauth', 'security', 'auth', 'encryption'].some((k) => lower.includes(k))) return 'Security'
  return 'Backend'
}

export default function Progress() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResources().then((data) => {
      setResources(data)
      setLoading(false)
    })
  }, [])

  const completed = resources.filter((r) => r.status === 'completed')
  const totalXp = completed.reduce((sum, r) => sum + r.xp, 0)
  const level = getLevel(totalXp)

  const skillCounts: Record<string, number> = {}
  completed.forEach((r) => {
    r.skills.forEach((skill) => {
      const cat = categorizeSkill(skill)
      skillCounts[cat] = (skillCounts[cat] || 0) + 1
    })
  })
  const maxSkill = Math.max(...Object.values(skillCounts), 1)

  const radarData = SKILL_CATEGORIES.map((cat) => ({
    category: cat,
    value: ((skillCounts[cat] || 0) / maxSkill) * 100,
    count: skillCounts[cat] || 0,
  }))

  const nextXp = level.xp_needed - totalXp
  const progressToNext = level.xp_needed - level.prev_xp > 0
    ? ((totalXp - level.prev_xp) / (level.xp_needed - level.prev_xp)) * 100
    : 100

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Carregando...</div>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">📈 Progress</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          {completed.length} recursos concluídos • {totalXp} XP total
        </p>
      </div>

      <div className="mb-12">
        <p className="text-center text-lg italic text-gray-500 dark:text-gray-400 mb-6">
          "Nada é mais motivador que o progresso"
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-gray-900">
          <h2 className="text-lg font-semibold mb-4 text-center">Skill Tree</h2>
          {completed.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              Conclua recursos para ver seu gráfico de skills.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#374151" />
                <PolarAngleAxis dataKey="category" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar
                  name="Skills"
                  dataKey="value"
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
          <div className="text-6xl mb-2">🏆</div>
          <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            Lv.{level.level}
          </div>
          <div className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">
            {level.name}
          </div>
          <div className="w-full max-w-xs">
            <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                style={{ width: `${progressToNext}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {nextXp > 0 ? `${nextXp} XP para o próximo nível` : 'Nível máximo!'}
            </p>
          </div>
        </div>
      </div>

      {completed.length > 0 && (
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-gray-900">
          <h2 className="text-lg font-semibold mb-4">Skills Adquiridas</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {skillCounts[cat] || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{cat}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
