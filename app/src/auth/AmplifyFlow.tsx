import { FormField, Input } from '@cloudscape-design/components'
import { Amplify, Auth } from 'aws-amplify'
import React from 'react'

// Form fields customization -> could be removed later
export const formFields = {
  signIn: {
    username: {
      placeholder: 'Enter Your Email Here',
      isRequired: true,
      label: 'Email:',
    },
  },
  signUp: {
    username: {
      placeholder: 'Enter Your Email Here',
      isRequired: true,
      label: 'Email:',
    },
  },
}

// Components customization use Cloudscape theme
// export const components = {
//   SignUp: {
//     // Footer() {
      
//     //   return (
//     //    <button> test </button>
//     //   );
//     // },  
//     FormFields() {
//       const [user, setUser] = React.useState({username:'', password:''})

//       return (
//         <>
//           <FormField label="Username">
//             <Input name="username" onChange={({ detail }) => setUser((u) => ( {...u, username:detail.value}))} value={user.username} />
//           </FormField>
//           <FormField label="Password">
//             <Input type="password" name="password" onChange={({ detail }) => setUser((u) => ({...u, password:detail.value}))} value={user.password} />
//           </FormField>
//         </>
//       )
//     },
//   },
// }

// Services customization
export const services = {
  async handleSignUp(formData) {
    console.log(formData)
    const params = new URLSearchParams(window.location.search) // id=123
    const aws = params.get('aws') || null
    let { username, password, attributes } = formData
    // custom username
    username = username.toLowerCase()
    if (aws) {
      attributes['custom:marketplace'] = aws
    }
    return Auth.signUp({
      username,
      password,
      attributes,
      autoSignIn: {
        enabled: true,
      },
    })
  },
  // async validateCustomSignUp(formData) {
  //   console.log(formData)
  //   return formData
  // },
}
