import { useAuth } from '@/hooks/useAuth'
import useSidebar from '@/hooks/useSidebar'
import { useSocket } from '@/hooks/useSocket'
import { LogOut, MessageCircleMoreIcon, X } from 'lucide-react'
import { FC } from 'react'
import Room from './Room'
import { Button } from './ui/button'

const Sidebar: FC = () => {
    const { sidebarRef, showSidebar, setShowSidebar } = useSidebar()
    const { user, logout } = useAuth()
    const { usersOnline, rooms } = useSocket()
    return (
        <div
            className={`border-r max-w-64 w-full h-full fixed sidebar bg-white transition-all duration-300 ease-in-out ${
                showSidebar ? 'active' : ''
            }`}
            ref={sidebarRef}
        >
            <header className="flex items-center border-b p-2 gap-2">
                <div className="w-full flex gap-2 flex-1">
                    <h1 className="text-lg font-semibold">{user?.username}</h1>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 w-fit h-fit p-2"
                        onClick={() => logout()}
                    >
                        <LogOut className="h-3 w-3" />
                        <span className="sr-only">Close navigation menu</span>
                    </Button>
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden w-fit h-fit p-2"
                    onClick={() => setShowSidebar(!showSidebar)}
                >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Close navigation menu</span>
                </Button>
            </header>
            <div className="flex-1 border-b">
                <div className="flex p-2 items-center justify-between border-b">
                    <h1 className="text-lg font-semibold">Rooms</h1>
                </div>
                <nav className="flex flex-col gap-2 p-2 text-sm font-medium">
                    {rooms.map((room) => (
                        <Room
                            id={room.id}
                            name={room.name}
                            type={room.type}
                            key={room.id}
                        />
                    ))}
                </nav>
            </div>
            <div className="flex-1 border-b">
                <div className="flex p-2 items-center justify-between border-b">
                    <h1 className="text-lg font-semibold">Users</h1>
                </div>
                <nav className="flex flex-col gap-2 p-2 text-sm font-medium">
                    {usersOnline.map((user) => (
                        <div
                            className="flex justify-between items-center border p-2 rounded-lg"
                            key={user.id}
                        >
                            <p className="online">{user.username}</p>
                            <Button
                                variant="outline"
                                size={'icon'}
                                className="p-2 w-fit h-fit text-muted-foreground transition-all hover:text-primary"
                            >
                                <MessageCircleMoreIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    )
}

export default Sidebar
