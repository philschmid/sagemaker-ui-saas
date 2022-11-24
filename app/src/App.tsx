import { Amplify } from 'aws-amplify'
import './App.css'
import React from 'react'
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './routes/Overview'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react'
import { formFields, services } from './auth/AmplifyFlow'

import '@cloudscape-design/global-styles/index.css'
import SignUp from './auth/SignUp'
import { Container } from '@cloudscape-design/components'
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



/**
 * Define your nav items here.
 */
const NAVIGATION_ITEMS: SideNavigationProps.Item[] = [
  { text: 'Overview', type: 'link', href: '/' },
  { text: 'Create Endpoint', type: 'link', href: '/new' },
]

/**
 * Context for updating/retrieving the AppLayout.
 */
export const AppLayoutContext = createContext({
  appLayoutProps: {},
  setAppLayoutProps: (_: AppLayoutProps) => {},
})

/**
 * Defines the App layout and contains logic for routing.
 */
const App: React.FC = () => {
  const navigate = useNavigate()
  const [activeHref, setActiveHref] = useState('/')
  const [activeBreadcrumbs, setActiveBreadcrumbs] = useState<BreadcrumbGroupProps.Item[]>([{ text: '/', href: '/' }])
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

      const segments = ['/', ...e.detail.href.split('/').filter((segment) => segment !== '')]
      setActiveBreadcrumbs(
        segments.map((segment, i) => {
          const href = segments
            .slice(0, i + 1)
            .join('/')
            .replace('//', '/')
          return {
            href,
            text: segment,
          }
        })
      )
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
          <AppLayoutContext.Provider value={{ appLayoutProps, setAppLayoutProps: setAppLayoutPropsSafe }}>
            <Routes>
              
              <Route path="/" element={<Overview />} />
              {/* <Route path="/new" element={<CreateEndpoint/>}/> */}
            </Routes>
          </AppLayoutContext.Provider>
        }
        {...appLayoutProps}
      /> *
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
