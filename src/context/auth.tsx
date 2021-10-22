import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

interface IUser {
  id: string;
  name: string;
  login: string;
  avatar_url: string;
}

interface IAuthContextData {
  user: IUser | null;
  signInUrl: string;
  signOut: () => void;
}

interface IAuthProvider {
  children: ReactNode
}

interface IAuthResponse {
  token: string;
  user: {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
  }
}

export const AuthContext = createContext({} as IAuthContextData);

export function AuthProvider(props: IAuthProvider) {
  const [user, setUser] = useState<IUser | null>(null);
  const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=8e7d9b0dd47737f2c97b`;

  useEffect(() => {
    const url = window.location.href;
    const hasGithubCode = url.includes('?code=');
  
    if(hasGithubCode) {
      const [urlWithoutCode, githubCode] = url.split('?code=');
  
      window.history.pushState({}, '', urlWithoutCode);
  
      signIn(githubCode);
    }
  })

  useEffect(() => {
    const token = localStorage.getItem('@doWhile:token');

    api.defaults.headers.common.authorization = `Bearer ${token}`;

    if (token) {
      api.get<IUser>('user/profile').then(response => {
        setUser(response.data);
      })
    }
  }, [])

  function signOut() {
    setUser(null);
    localStorage.removeItem('@doWhile:token');
  }

  async function signIn(githubCode: string) {
    const response = await api.post<IAuthResponse>('authenticate', {
      code: githubCode
    });
 
    const { token, user } = response.data;
  
    localStorage.setItem('@doWhile:token', token);

    api.defaults.headers.common.authorization = `Bearer ${token}`;
  
    setUser(user);
  }

  return (
    <AuthContext.Provider value={{ signInUrl, user, signOut }}>
      {props.children}
    </AuthContext.Provider>
  )
}