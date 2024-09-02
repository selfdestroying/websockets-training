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
    Room,
    ServerToClientEvents,
    User,
} from '../../../types'

interface ISocketContext {
    socket: Socket | null
    usersOnline: User[]
    messages: Message[]
    setMessages: Dispatch<SetStateAction<Message[]>>
    rooms: Room[]
    currentRoom: Room | null
    setCurrentRoom: Dispatch<SetStateAction<Room | null>>
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
    rooms: [],
    currentRoom: null,
    setCurrentRoom: () => {},
}

export const SocketContext = createContext<ISocketContext>(initialState)

export const SocketProvider: FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket<
        ServerToClientEvents,
        ClientToServerEvents
    > | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [usersOnline, setUsersOnline] = useState<User[]>([])
    const [rooms, setRooms] = useState<Room[]>([])
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null)
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

        socketInstance.on('rooms', (rooms: Room[]) => {
            console.log(rooms)
            setRooms(rooms)
        })

        socketInstance.on('createRoom', (room: Room) => {
            setCurrentRoom(room)
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
        rooms,
        currentRoom,
        setCurrentRoom,
    }

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    )
}
