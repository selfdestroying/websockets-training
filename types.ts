export interface ServerToClientEvents {
    message: (data: Message) => void
    rooms: (rooms: Room[]) => void
    createRoom: (room: Room) => void
    usersOnline: (usersOnline: User[]) => void
    startTyping: (usersTyping: string[]) => void
    stopTyping: (usersTyping: string[]) => void
}
export interface ClientToServerEvents {
    message: (data: Message, callback: () => void) => void
    joinRoom: (data: JoinRoomData, callback: () => void) => void
    createRoom: (data: CreatePrivateRoomData, callback: () => void) => void
    startTyping: (callback: () => void) => void
    stopTyping: (callback: () => void) => void
}
export interface InterServerEvents {}
export interface SocketData {
    user: User
}

interface JoinRoomData {
    currentRoom: Room
    roomToJoin: Room
}

interface CreatePrivateRoomData {
    user: User
    type: string
    currentRoom: Room
}

export interface AuthData {
    username: string
    password: string
}

export interface User {
    id: number
    username: string
    password: string
    status: string
}

export interface Message {
    id?: number | bigint
    text: string
    createdAt: string
    type: 'text' | 'image' | 'video' | 'service'
    username: string
    clientOffset: string
    userId: number
    roomId: number
}

export interface Room {
    id: number | bigint
    name: string
    type: string
}
