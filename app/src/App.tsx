import './App.css'
import React from 'react'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'

import '@cloudscape-design/global-styles/index.css'
import {
  BreadcrumbGroup,
  BreadcrumbGroupProps,
  SideNavigation,
  SideNavigationProps,
} from '@cloudscape-design/components'
import AppLayout, { AppLayoutProps } from '@cloudscape-design/components/app-layout'
import { CancelableEventHandler } from '@cloudscape-design/components/internal/events'
import { createContext, useCallback, useMemo, useState } from 'react'
import Auth from './auth/Auth'
import Config from './config.json'
import NavHeader from './components/NavHeader'
// import CreateEndpoint from './pages/CreateEndpoint';
import Overview from './routes/Overview'
import Models from './routes/Models'
import ModelDetail from './routes/ModelDetail'
import CreateEndpoint from './routes/CreateEndpoint'

/**
 * Define your nav items here.
 */
const NAVIGATION_ITEMS: SideNavigationProps.Item[] = [
  { text: 'Overview', type: 'link', href: '/' },
  { text: 'Hugging Face Models', type: 'link', href: '/models' },
  { text: 'Create Endpoint', type: 'link', href: '/endpoints/new' },
]

/**
 * Context for updating/retrieving the AppLayout.
 */
export const AppLayoutContext = createContext({
  appLayoutProps: {},
  setAppLayoutProps: (_: AppLayoutProps) => {},
  onNavigate: {},
})

const createBreadcrumbItems = (path: string): BreadcrumbGroupProps.Item[] => {
  const segments = ['/', ...path.split('/').filter((segment) => segment !== '')]
  const breadcrumb = segments.map((segment, i) => {
    const href = segments
      .slice(0, i + 1)
      .join('/')
      .replace('//', '/')
    return {
      href,
      text: segment,
    }
  })
  return breadcrumb
}
/**
 * Defines the App layout and contains logic for routing.
 */
const App: React.FC = () => {
  const navigate = useNavigate()
  const [activeHref, setActiveHref] = useState(window.location.pathname)
  const [activeBreadcrumbs, setActiveBreadcrumbs] = useState<BreadcrumbGroupProps.Item[]>(
    createBreadcrumbItems(window.location.pathname)
  )
  const [appLayoutProps, setAppLayoutProps] = useState<AppLayoutProps>({})

  const setAppLayoutPropsSafe = useCallback(
    (props: AppLayoutProps) => {
      JSON.stringify(appLayoutProps) !== JSON.stringify(props) && setAppLayoutProps(props)
    },
    [appLayoutProps]
  )

  const onNavigate = useMemo(
    (): CancelableEventHandler<BreadcrumbGroupProps.ClickDetail | SideNavigationProps.FollowDetail> => (e) => {
      e.preventDefault()
      setAppLayoutProps({})
      setActiveHref(e.detail.href)

      const segments = setActiveBreadcrumbs(createBreadcrumbItems(e.detail.href))
      navigate(e.detail.href)
    },
    [navigate, setAppLayoutProps, setActiveBreadcrumbs]
  )
  return (
    <Auth>
      <NavHeader />
      <AppLayout
        breadcrumbs={<BreadcrumbGroup onFollow={onNavigate} items={activeBreadcrumbs} />}
        // toolsHide
        navigation={
          <SideNavigation
            header={{ text: Config.applicationName, href: '/' }}
            activeHref={activeHref}
            onFollow={onNavigate}
            items={NAVIGATION_ITEMS}
          />
        }
        content={
          <AppLayoutContext.Provider value={{ appLayoutProps, setAppLayoutProps: setAppLayoutPropsSafe, onNavigate }}>
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/models" element={<Models />} />
              <Route path="/models/:user/:repo" element={<ModelDetail />} />
              <Route path="/models/:user" element={<ModelDetail />} />
              {/* <Route path="/endpoints" element={<ModelDetail />} />
              <Route path="/endpoints/:id" element={<ModelDetail />} /> */}
              <Route path="/endpoints/new" element={<CreateEndpoint />} />
              {/* <Route path="/new" element={<CreateEndpoint/>}/> */}
            </Routes>
          </AppLayoutContext.Provider>
        }
        {...appLayoutProps}
      />
    </Auth>
  )
}

export default App

// const SomeComponent = (app) => {
//   const params = new URLSearchParams(window.location.search) // id=123
//   let param = params.get('aws-id') // 123

//   const loginOptions = {}
//   if (param) {
//     loginOptions['aws-id'] = param
//   }
//   // const param = searchParams.get('test')
//   return withAuthenticationRequired(app, {
//     // Show a message while the user waits to be redirected to the login page.
//     onRedirecting: () => <div>Loading</div>,
//     loginOptions
//   });
// };

// export default withAuthenticator(App);
