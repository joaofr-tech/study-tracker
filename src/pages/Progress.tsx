import { useEffect, useState } from 'react'
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'
import { fetchResources } from '../lib/db'
import type { Resource } from '../types'

const SKILL_TREE = [
  {
    category: 'Back-end',
    keywords: ['back-end', 'backend', 'api', 'rest', 'graphql', 'java', 'node', 'python', 'server', 'spring'],
  },
  {
    category: 'Front-end',
    keywords: ['front-end', 'frontend', 'react', 'vue', 'angular', 'html', 'css', 'ui', 'ux'],
  },
  {
    category: 'DevOps',
    keywords: ['devops', 'docker', 'kubernetes', 'deploy', 'ci/cd', 'terraform', 'containers'],
  },
  {
    category: 'Cloud',
    keywords: ['cloud', 'aws', 'azure', 'gcp', 's3', 'ec2', 'iam', 'serverless'],
  },
  {
    category: 'Data',
    keywords: ['data', 'dados', 'sql', 'database', 'postgresql', 'pandas', 'analytics', 'ml', 'ai'],
  },
  {
    category: 'Security',
    keywords: ['security', 'seguranca', 'jwt', 'oauth', 'auth', 'encryption', 'pkce'],
  },
]

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function getResourceCategories(resource: Resource) {
  const searchable = normalize([resource.name, ...resource.tags, ...resource.skills].join(' '))

  return SKILL_TREE.filter(({ keywords }) =>
    keywords.some((keyword) => searchable.includes(normalize(keyword)))
  ).map(({ category }) => category)
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

  const completed = resources.filter((resource) => resource.status === 'completed')
  const counts = Object.fromEntries(SKILL_TREE.map(({ category }) => [category, 0])) as Record<string, number>

  completed.forEach((resource) => {
    const categories = getResourceCategories(resource)
    categories.forEach((category) => {
      counts[category] += 1
    })
  })

  const maxCount = Math.max(...Object.values(counts), 1)
  const data = SKILL_TREE.map(({ category }) => ({
    category,
    recursos: counts[category],
  }))

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Carregando...</div>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Skill Tree</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Recursos concluidos categorizados por tags, skills e titulo
        </p>
      </div>

      <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 bg-white dark:bg-gray-900">
        {completed.length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-sm">
            Conclua recursos para formar sua Skill Tree.
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
    </div>
  )
}
