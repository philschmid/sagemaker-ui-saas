import { useAuthenticator } from "@aws-amplify/ui-react";
import React, { useContext } from "react";
import { Navigate, redirect } from "react-router-dom";


export default function Home() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  // const { avatar_url, name, public_repos, followers, following } = state.user

  return (
      <div className="container">
        <h1>Home</h1>
        <button onClick={signOut}>Sign out</button>
        {/* <div>
          <div className="content">
            <img src={avatar_url} alt="Avatar"/>
            <span>{name}</span>
            <span>{public_repos} Repos</span>
            <span>{followers} Followers</span>
            <span>{following} Following</span>
          </div>
        </div> */}
      </div>
  );
}
