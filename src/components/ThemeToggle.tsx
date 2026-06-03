interface ThemeToggleProps {
  dark: boolean
  toggle: () => void
}

export default function ThemeToggle({ dark, toggle }: ThemeToggleProps) {
  return (
    <button
      onClick={toggle}
      className="relative w-14 h-7 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center transition-transform text-sm ${
          dark ? 'translate-x-7' : ''
        }`}
      >
        {dark ? '🌙' : '☀️'}
      </span>
    </button>
  )
}
