import useSidebar from '@/hooks/useSidebar'
import { Menu } from 'lucide-react'
import { FC } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

const Chat: FC = () => {
    const { showSidebar, setShowSidebar } = useSidebar()
    return (
        <div className="flex flex-1 flex-col h-full ml-0 md:ml-64 transition-all duration-300 ease-in-out">
            <header className="flex items-center border-b p-2 gap-2">
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
            <main className="flex flex-col flex-1">
                <div className="flex flex-col justify-end flex-1 p-2  border-b ">
                    <p>Message 1</p>
                    <p>Message 1</p>
                    <p>Message 1</p>
                    <p>Message 1</p>
                    <p>Message 2</p>
                    <p>Message 2</p>
                </div>
                <form>
                    <div className="flex gap-2 p-2 lg:gap-4">
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="flex-1 appearance-none bg-background shadow-none"
                        />
                        <Button>Send</Button>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default Chat
