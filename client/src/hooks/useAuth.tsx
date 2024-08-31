import { AuthContext } from '@/prodivers/AuthProvider'
import { useContext } from 'react'

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
