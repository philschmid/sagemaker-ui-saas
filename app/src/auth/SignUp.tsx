import * as React from "react";
import Form from "@cloudscape-design/components/form";
import { Button, FormField, Header, Input, SpaceBetween } from "@cloudscape-design/components";
import { Auth } from "aws-amplify";
import { useSearchParams } from "react-router-dom";

export default () => {
  const [user, setUser] = React.useState({username:'', password:''})
  // const [searchParams, setSearchParams] = useSearchParams();

  const handleSignUp = async (e) => {
    e.preventDefault()
    const params = new URLSearchParams(window.location.search) // id=123
    const aws =  params.get('aws') || null
    // custom username
    const attributes = {}
    if (aws) {
      attributes['custom:marketplace'] = aws
    }
    return Auth.signUp({
      username: user.username,
      password: user.password,
      attributes: attributes,
      autoSignIn: {
        enabled: true,
      },
    })
  }
  
  return (
    
    <form onSubmit={handleSignUp}>
      <Form
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button formAction="none" variant="link">
              Cancel
            </Button>
            <Button variant="primary">Submit</Button>
          </SpaceBetween>
        }
        header={<Header variant="h1">Form header</Header>}
      >
          <FormField label="Username">
            <Input name="username" onChange={({ detail }) => setUser((u) => ( {...u, username:detail.value}))} value={user.username} />
          </FormField>
          <FormField label="Password">
            <Input type="password" name="password" onChange={({ detail }) => setUser((u) => ({...u, password:detail.value}))} value={user.password} />
          </FormField>
      </Form>
    </form>
  );
}