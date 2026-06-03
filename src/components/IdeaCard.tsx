import { useState } from 'react'
import type { ProjectIdea, IdeaStatus, Complexity } from '../types'
import { IDEA_STATUS, COMPLEXITY, COMPLEXITY_LABEL } from '../types'

interface IdeaCardProps {
  idea: ProjectIdea
  onUpdate: (id: string, updates: Partial<ProjectIdea>) => void
  onDelete: (id: string) => void
}

const STATUS_COLORS: Record<IdeaStatus, string> = {
  idea: '#f59e0b',
  exploring: '#3b82f6',
  in_progress: '#6366f1',
  mvp: '#10b981',
  launched: '#8b5cf6',
}

export default function IdeaCard({ idea, onUpdate, onDelete }: IdeaCardProps) {
  const [expanded, setExpanded] = useState(false)

  const [problem, setProblem] = useState(idea.problem || '')
  const [solution, setSolution] = useState(idea.solution || '')
  const [techInput, setTechInput] = useState((idea.technologies || []).join(', '))
  const [nextStep, setNextStep] = useState(idea.next_step || '')
  const [complexity, setComplexity] = useState<Complexity>(idea.complexity)
  const [status, setStatus] = useState<IdeaStatus>(idea.status)
  const [repoUrl, setRepoUrl] = useState(idea.repo_url || '')

  const handleSave = () => {
    const technologies = techInput.split(',').map((s) => s.trim()).filter(Boolean)
    onUpdate(idea.id, {
      problem: problem || null,
      solution: solution || null,
      technologies: technologies.length > 0 ? technologies : null,
      next_step: nextStep || null,
      complexity,
      status,
      repo_url: status === 'in_progress' ? (repoUrl || null) : idea.repo_url,
    })
    setExpanded(false)
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-5 bg-white dark:bg-gray-900 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 pr-3 flex-1">
          <h3 className="font-semibold text-lg break-words">{idea.title}</h3>
          {idea.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {idea.description}
            </p>
          )}
        </div>
        <button
          onClick={() => onDelete(idea.id)}
          className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          x
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: STATUS_COLORS[idea.status] }}
        >
          {IDEA_STATUS[idea.status]}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {COMPLEXITY_LABEL[idea.complexity]}
        </span>
      </div>

      {idea.technologies && idea.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {idea.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {idea.next_step && (
        <div className="text-xs text-indigo-600 dark:text-indigo-400 mb-3">
          🎯 Próximo passo: {idea.next_step}
        </div>
      )}

      {idea.repo_url && (
        <a
          href={idea.repo_url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 mb-3"
        >
          Ver repositório
        </a>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          {expanded ? 'Recolher' : '🔬 Amadurecer'}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Problema</label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              placeholder="Que dor isso resolve?"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Solução</label>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              placeholder="Como resolve?"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Tecnologias (separadas por vírgula)</label>
            <input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="React, Python, AWS"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Status</label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.entries(IDEA_STATUS) as [IdeaStatus, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setStatus(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    status === key
                      ? 'text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                  style={{
                    backgroundColor: status === key ? STATUS_COLORS[key] : undefined,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Complexidade</label>
            <div className="flex gap-1.5">
              {COMPLEXITY.map((c) => (
                <button
                  key={c}
                  onClick={() => setComplexity(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    complexity === c
                      ? 'bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {COMPLEXITY_LABEL[c]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Próximo passo</label>
            <input
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              placeholder="Qual a menor ação pra avançar?"
            />
          </div>

          {status === 'in_progress' && (
            <div>
              <label className="block text-xs font-medium mb-1">
                Link do repositório
                <span className="text-gray-400 font-normal"> (opcional)</span>
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="https://github.com/seu-user/seu-repo"
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setExpanded(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
