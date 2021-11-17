import Router from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { setCookie, parseCookies } from "nookies";

import { api } from "../services/api";

type AuxPropsType = {
    children: ReactNode;
}

type SignInDataType = {
    cpf: string;
    password: string;
}

type UserType = {
    id: string;
    name: string;
    email: string;
    phone: string;
    cpf: string;
    occupation_id?: string;
}

type AuthContextType = {
    isAuthenticated: boolean;
    user: UserType | null;
    signIn: (data: SignInDataType) => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType);

const AuthProvider = ({ children }: AuxPropsType) => {
    const [user, setUser] = useState<UserType | null>(null);
    
    const isAuthenticated = !!user;
    
    useEffect(() => {
        const { 'opdauth.token': token } = parseCookies();
    
        if (token) {
            api.post('/managers/token', {
                token,
            }).then(res => {
                setUser(res.data.manager);
            })
        }
    }, []);

    const signIn = async ({ cpf, password }: SignInDataType) => {
        const { acessToken: token, manager: user } = await api.post('managers/login', {
            cpf,
            password
        }).then(res => {
            return res.data;
        })

        if (token) {
            setCookie(undefined, 'opdauth.token', token, {
                maxAge: 60 * 60 * 0.5, // 30 minutes
            });

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
            setUser(user);
    
            Router.push('/dashboard');
        }
    }    

    return (
          <AuthContext.Provider value={{ isAuthenticated, user, signIn }}>
              { children }
          </AuthContext.Provider>  
    );
}

export default AuthProvider;