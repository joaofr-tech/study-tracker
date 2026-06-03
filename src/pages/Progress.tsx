import { useEffect, useState } from 'react'
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'
import { fetchResources } from '../lib/db'
import { AREAS, AREA_COLORS } from '../types'
import type { Resource, Area } from '../types'

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

  const counts = Object.fromEntries(AREAS.map((a) => [a, 0])) as Record<Area, number>
  completed.forEach((r) => {
    r.areas.forEach((area) => {
      if (area in counts) counts[area] += 1
    })
  })

  const maxCount = Math.max(...Object.values(counts), 1)
  const data = AREAS.map((area) => ({
    category: area,
    recursos: counts[area],
    fill: AREA_COLORS[area],
  }))

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Carregando...</div>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">📈 Progresso</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Recursos concluídos por área
        </p>
      </div>

      <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-gray-900">
        {completed.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-sm">
            Conclua recursos para formar seu mapa de habilidades.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={420}>
            <RadarChart data={data}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="category" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, maxCount]} allowDataOverflow={false} tick={false} />
              <Tooltip />
              <Radar
                name="Recursos"
                dataKey="recursos"
                stroke="#6366F1"
                fill="#6366F1"
                fillOpacity={0.25}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3 mt-6">
        {AREAS.map((area) => (
          <div
            key={area}
            className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <div
              className="text-2xl font-bold rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-1 text-white"
              style={{ backgroundColor: AREA_COLORS[area] }}
            >
              {counts[area]}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{area}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
