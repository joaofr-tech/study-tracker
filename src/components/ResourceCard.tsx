import type { Resource } from '../types'

interface ResourceCardProps {
  resource: Resource
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export default function ResourceCard({ resource, onToggle, onDelete }: ResourceCardProps) {
  const isCompleted = resource.status === 'completed'

  return (
    <div
      className={`border rounded-xl p-5 transition-all bg-white dark:bg-gray-900 ${
        isCompleted
          ? 'border-green-300 dark:border-green-800 opacity-75'
          : 'border-gray-200 dark:border-gray-800 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className={`font-semibold text-lg ${isCompleted ? 'line-through text-gray-400' : ''}`}>
          {resource.name}
        </h3>
        <div className="flex gap-1">
          {!isCompleted && (
            <button
              onClick={() => onToggle(resource.id, true)}
              className="px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Concluir
            </button>
          )}
          {isCompleted && (
            <button
              onClick={() => onToggle(resource.id, false)}
              className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            >
              Reabrir
            </button>
          )}
          <button
            onClick={() => onDelete(resource.id)}
            className="px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="mb-3">
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isCompleted ? 'bg-green-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${resource.progress}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
          {resource.progress}% • {resource.xp} XP
        </span>
      </div>

      {resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {resource.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs rounded text-gray-600 dark:text-gray-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {resource.skills.length > 0 && !isCompleted && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Skills: {resource.skills.join(', ')}
        </div>
      )}
      {isCompleted && resource.completed_at && (
        <div className="text-xs text-green-600 dark:text-green-400">
          ✅ Concluído em {new Date(resource.completed_at).toLocaleDateString('pt-BR')}
        </div>
      )}
    </div>
  )
}
