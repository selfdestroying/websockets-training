import { useSocket } from '@/hooks/useSocket'
import { ArrowRight } from 'lucide-react'
import { FC } from 'react'
import { type Room } from '../../../types'
import { Button } from './ui/button'

const Room: FC<Room> = ({ id, name, type }) => {
    const { socket, setCurrentRoom, setMessages, currentRoom } = useSocket()
    const joinRoom = () => {
        socket?.emit('joinRoom', {
            currentRoom,
            roomToJoin: {
                id,
                name,
                type,
            },
        })
        setCurrentRoom({ id, name, type })
        setMessages([])
    }
    return (
        <div
            className={`flex justify-between items-center border p-2 rounded-lg ${
                currentRoom?.id === id ? 'bg-gray-100' : ''
            }`}
        >
            <div>
                <p>{name}</p>
                <p className="text-muted-foreground text-xs italic">{type}</p>
            </div>
            {currentRoom?.id != id && (
                <Button
                    variant="outline"
                    size={'icon'}
                    className="p-2 w-fit h-fit text-muted-foreground transition-all hover:text-primary"
                    onClick={joinRoom}
                >
                    <ArrowRight className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}

export default Room
