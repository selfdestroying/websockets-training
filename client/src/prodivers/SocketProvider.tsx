import {
    createContext,
    FC,
    ReactNode,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { io, Socket } from 'socket.io-client'

interface ISocketContext {
    socket: Socket | null
}

interface SocketProviderProps {
    children: ReactNode
}

const URL = 'http://localhost:3000'
export const socket = io(URL, {
    autoConnect: false,
})

export const SocketContext = createContext<ISocketContext | null>(null)

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
    const [socketInstance, setSocketInstance] = useState<Socket | null>(null)

    useEffect(() => {
        setSocketInstance(socket)

        return () => {
            socket.disconnect()
        }
    }, [])

    const value = useMemo(() => ({ socket: socketInstance }), [socketInstance])

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}
