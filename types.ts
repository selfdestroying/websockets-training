export interface ServerToClientEvents {
    message: (data: Message) => void
    clientConnect: (usersOnline: User[]) => void
    clientDisconnect: (username: string) => void
    startTyping: (usersTyping: string[]) => void
    stopTyping: (usersTyping: string[]) => void
}
export interface ClientToServerEvents {
    message: (data: Message, callback: () => void) => void
    startTyping: (callback: () => void) => void
    stopTyping: (callback: () => void) => void
}
export interface InterServerEvents {}
export interface SocketData {
    user: User
}

export interface User {
    id: number
    username: string
    status: string
}

export interface Message {
    id?: number | bigint
    text: string
    createdAt: string
    type: 'text' | 'image' | 'video' | 'service'
    userId: number
    clientOffset: string
}
