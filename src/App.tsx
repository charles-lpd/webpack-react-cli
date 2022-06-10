import React, { lazy, Suspense } from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import { Button } from 'antd'
import { Provider } from 'react-redux'
import { store } from './store/store'
const Home = lazy(() => import('./pages/home'))
const About = lazy(() => import('./pages/about'))
const NotFound = lazy(() => import('./pages/NotFound'))
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="app">
        app
        <Button type="primary">按钮</Button>
        <ul>
          <li>
            <Link to="/">home</Link>
          </li>
          <li>
            <Link to="/about/1">about</Link>
          </li>
        </ul>
        <Suspense fallback={<div>loading....</div>}>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/about/:id" element={<About />}></Route>
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </Provider>
  )
}
export default App
