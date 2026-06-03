import { ReactNode } from 'react'
import Navbar from './Navbar'
import { useTheme } from '../lib/useTheme'

export default function Layout({ children }: { children: ReactNode }) {
  const { dark, toggle } = useTheme()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar dark={dark} toggleTheme={toggle} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
