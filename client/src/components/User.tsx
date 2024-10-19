import { useAuth } from '@/hooks/useAuth'
import { useSocket } from '@/hooks/useSocket'
import { MessageCircleMoreIcon } from 'lucide-react'
import { FC } from 'react'
import { type User } from '../../../types'
import { Button } from './ui/button'

const User: FC<User> = ({ id, username }) => {
    const { socket, currentRoom, setMessages } = useSocket()
    const { user } = useAuth()
    const createRoom = () => {
        const names = [user?.username, username]
        const name = names.sort().join('-')
        socket?.emit('joinRoom', {
            currentRoom,
            roomToJoin: {
                name,
                type: 'private',
            },
            user: { id, username },
        })
        setMessages([])
    }
    return (
        <div
            className="flex justify-between items-center border p-2 rounded-lg"
            key={id}
        >
            <p className="online">{username}</p>
            <Button
                variant="outline"
                size={'icon'}
                className="p-2 w-fit h-fit text-muted-foreground transition-all hover:text-primary"
                onClick={createRoom}
            >
                <MessageCircleMoreIcon className="h-4 w-4" />
            </Button>
        </div>
    )
}

export default User
