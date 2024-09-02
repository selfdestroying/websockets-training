import useSidebar from '@/hooks/useSidebar'
import { useSocket } from '@/hooks/useSocket'
import { Menu } from 'lucide-react'
import { FC, useEffect, useRef } from 'react'
import MessageForm from './MessageForm'
import { Button } from './ui/button'

const Chat: FC = () => {
    const { showSidebar, setShowSidebar } = useSidebar()
    const { messages, currentRoom } = useSocket()
    const scrollRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current?.scrollHeight })
    }, [messages])

    return (
        <div className="flex flex-1 flex-col justify-between h-screen ml-0 md:ml-64 transition-all duration-300 ease-in-out">
            <header className="flex items-center border-b p-2 gap-2 h-[47px]">
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden w-fit h-fit p-2"
                    onClick={() => setShowSidebar(!showSidebar)}
                >
                    <Menu className="h-3 w-3" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
                <div className="w-full flex-1">
                    <h1 className="text-lg font-semibold">Chat</h1>
                </div>
            </header>
            {currentRoom ? (
                <>
                    <div
                        className="flex-1 p-2 border-b overflow-y-scroll"
                        ref={scrollRef}
                    >
                        {messages.map((message) => (
                            <p key={message.id}>
                                {message.id?.toString()} - {message.username} -{' '}
                                {message.text} - {message.createdAt}
                            </p>
                        ))}
                    </div>

                    <MessageForm />
                </>
            ) : (
                <div className="flex-1 flex justify-center items-center">
                    👋 Join a room to start chatting!
                </div>
            )}
        </div>
    )
}

export default Chat
