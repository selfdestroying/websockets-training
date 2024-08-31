import {
    createContext,
    FC,
    ReactNode,
    useEffect,
    useMemo,
    useState,
} from 'react'

import { api } from '@/api'
import { AuthData, User } from '../../../types'

interface IAuthContext {
    user: User | null
    isAuthenticated: boolean
    login: (data: AuthData) => Promise<void>
    logout: () => void
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthContext = createContext<IAuthContext>({
    user: null,
    isAuthenticated: false,
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

    const login = async (data: AuthData) => {
        try {
            const response = await api.post('/login', data)
            const user = response.data
            console.log(user)
            setUser(user)
            setIsAuthenticated(true)
        } catch {
            setUser(null)
            setIsAuthenticated(false)
        }
    }
    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
    }

    const value = useMemo<IAuthContext>(
        () => ({ user, isAuthenticated, login, logout }),
        [user, isAuthenticated],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
