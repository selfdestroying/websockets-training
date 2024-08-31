import {
    createContext,
    FC,
    ReactNode,
    useEffect,
    useMemo,
    useState,
} from 'react'

import { api } from '@/api'
import { AxiosError } from 'axios'
import { AuthData, User } from '../../../types'

interface IAuthContext {
    user: User | null
    isAuthenticated: boolean
    register: (data: AuthData) => Promise<void>
    login: (data: AuthData) => Promise<void>
    logout: () => void
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthContext = createContext<IAuthContext>({
    user: null,
    isAuthenticated: false,
    register: async () => {},
    login: async () => {},
    logout: () => {},
})

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    useEffect(() => {
        const user = localStorage.getItem('user')
        if (user) {
            setUser(JSON.parse(user))
        }
    }, [])

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
            setIsAuthenticated(true)
        } else {
            localStorage.removeItem('user')
            setIsAuthenticated(false)
        }
    }, [user])

    const register = async (data: AuthData) => {
        try {
            const response = await api.post('/register', data)
            const user = response.data
            setUser(user)
            setIsAuthenticated(true)
        } catch {
            setUser(null)
            setIsAuthenticated(false)
        }
    }

    const login = async (data: AuthData) => {
        try {
            const response = await api.post('/login', data)
            const user = response.data
            setUser(user)
            setIsAuthenticated(true)
        } catch (error) {
            setUser(null)
            setIsAuthenticated(false)
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.error)
            }
        }
    }
    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
    }

    const value = useMemo<IAuthContext>(
        () => ({ user, isAuthenticated, login, logout, register }),
        [user, isAuthenticated],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
