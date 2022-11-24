import { Authenticator, ThemeProvider, Theme, useTheme } from '@aws-amplify/ui-react'
import { Amplify, Auth as AmplifyAuth, Hub } from 'aws-amplify'
import React, { createContext, useCallback, useEffect, useState, useMemo } from 'react'
import { formFields, services } from './AmplifyFlow'

Amplify.configure({
  Auth: {
    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
    // REQUIRED - Amazon Cognito Region
    region: import.meta.env.VITE_REGION,
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: import.meta.env.VITE_USER_POOL_ID,
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: import.meta.env.VITE_USER_POOL_WEB_CLIENT_ID,
    signUpVerificationMethod: import.meta.env.VITE_SIGN_UP_VERIFICATION_METHOD,
  },
})

/**
 * Context for storing the runtimeContext.
 */
export const RuntimeConfigContext = createContext<any>({})

/**
 * Sets up the runtimeContext and Cognito auth.
 *
 * This assumes a runtime-config.json file is present at '/'. In order for Auth to be set up automatically,
 * the runtime-config.json must have the following properties configured: [region, userPoolId, userPoolWebClientId, identityPoolId].
 */
const Auth: React.FC<any> = ({ children }) => {
  const [runtimeContext, setRuntimeContext] = useState<any>(undefined)
  const { tokens } = useTheme()

  // Customize your login theme
  const theme: Theme = useMemo(
    () => ({
      name: 'AuthTheme',
      tokens: {
        components: {
          passwordfield: {
            button: {
              _hover: {
                backgroundColor: {
                  value: 'white',
                },
                borderColor: {
                  value: "#0972d3",
                },
              },
            },
          },
        },
        colors: {
          brand: {
            primary: {
              10: {value: "#0972d3"},
              80:{value: "#0972d3"},
              90: {value: "#0972d3"},
              100: {value: "#0972d3"},
            },
          },
        },
      },
    }),
    [tokens]
  )

  useEffect(() => {
    AmplifyAuth.currentUserInfo()
      .then((user) => setRuntimeContext({ user }))
      .catch((e) => setRuntimeContext({}))
  }, [setRuntimeContext])

  useEffect(() => {
    Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signIn':
          AmplifyAuth.currentUserInfo()
            .then((user) => setRuntimeContext((prevRuntimeContext: any) => ({ ...prevRuntimeContext, user })))
            .catch((e) => console.error(e))
          break
        case 'signOut':
          window.location.reload()
          break
      }
    })
  }, [])

  const AuthWrapper: React.FC<any> = useCallback(
    ({ children: _children }) =>
        <ThemeProvider theme={theme}>
          <Authenticator services={services} formFields={formFields}>
            {_children}
          </Authenticator>
        </ThemeProvider>
      ,
    [runtimeContext, theme]
  )

  return (
    <AuthWrapper>
      <RuntimeConfigContext.Provider value={{ runtimeContext, setRuntimeContext }}>
        {children}
      </RuntimeConfigContext.Provider>
    </AuthWrapper>
  )
}

export default Auth
