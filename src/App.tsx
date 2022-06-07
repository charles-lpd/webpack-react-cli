import React, { lazy, Suspense } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
// import Home from './Home'
// import About from './About'
import { Button } from 'antd'
const Home = lazy(() => import('./Home/index'))
const About = lazy(() => import('./About/index'))

const App: React.FC = () => {
  return (
    <div className="app">
      app
      <Button type="primary">按钮</Button>
      <ul>
        <li>
          <Link to="/home">home</Link>
        </li>
        <li>
          <Link to="/about/1">about</Link>
        </li>
      </ul>
      <Suspense fallback={<div>loading....</div>}>
        <Routes>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/about/:id" element={<About />}></Route>
        </Routes>
      </Suspense>
    </div>
  )
}
export default App
