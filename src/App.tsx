import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Library from './pages/Library'
import Glossary from './pages/Glossary'
import Platforms from './pages/Platforms'
import Completed from './pages/Completed'
import Progress from './pages/Progress'
import Ideas from './pages/Ideas'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Library />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/platforms" element={<Platforms />} />
        <Route path="/completed" element={<Completed />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/ideas" element={<Ideas />} />
      </Routes>
    </Layout>
  )
}
