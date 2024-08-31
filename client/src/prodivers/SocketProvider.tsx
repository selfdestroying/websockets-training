import { useAuth } from '@/hooks/useAuth'
import {
    createContext,
    Dispatch,
    FC,
    ReactNode,
    SetStateAction,
    useEffect,
    useState,
} from 'react'
import { io, Socket } from 'socket.io-client'
import {
    ClientToServerEvents,
    Message,
    ServerToClientEvents,
    User,
} from '../../../types'

interface ISocketContext {
    socket: Socket | null
    usersOnline: User[]
    messages: Message[]
    setMessages: Dispatch<SetStateAction<Message[]>>
}

interface SocketProviderProps {
    children: ReactNode
}

const URL = 'http://localhost:3000'

const initialState: ISocketContext = {
    socket: null,
    usersOnline: [],
    messages: [],
    setMessages: () => {},
}

export const SocketContext = createContext<ISocketContext>(initialState)

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket<
        ServerToClientEvents,
        ClientToServerEvents
    > | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [usersOnline, setUsersOnline] = useState<User[]>([])
    const { isAuthenticated, user } = useAuth()
    useEffect(() => {
        if (!isAuthenticated) return
        const socketInstance = io(URL, {
            auth: {
                user: user,
            },
            autoConnect: false,
            ackTimeout: 5000,
            retries: 3,
        })

        socketInstance.on('connect', () => {
            console.log('socket connected')
        })

        socketInstance.on('usersOnline', (users: User[]) => {
            setUsersOnline(users)
        })

        socketInstance.on('message', (message: Message) => {
            setMessages((prev) => [...prev, message])
        })

        setSocket(socketInstance)

        return () => {
            if (socket) socket.disconnect()
        }
    }, [isAuthenticated])

    const value = {
        socket,
        usersOnline,
        messages,
        setMessages,
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}
