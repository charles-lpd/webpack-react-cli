import React, { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'antd'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { useRoutes } from 'react-router-dom'
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))
const App: React.FC = () => {
  const element = useRoutes([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/about/:id',
      element: <About />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])
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
          {/* <Route path="/" element={<Home />}></Route>
            <Route path="/about/:id" element={<About />}></Route>
            <Route path="*" element={<NotFound />} /> */}
          {element}
        </Suspense>
      </div>
    </Provider>
  )
}
export default App
