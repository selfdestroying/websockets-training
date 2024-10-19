import { useAuth } from '@/hooks/useAuth'
import useSidebar from '@/hooks/useSidebar'
import { useSocket } from '@/hooks/useSocket'
import { LogOut, X } from 'lucide-react'
import { FC } from 'react'
import Room from './Room'
import { Button } from './ui/button'
import User from './User'

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
                            {...room}
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
                    {usersOnline.map(
                        (u) =>
                            u.id !== user?.id && (
                                <User
                                    key={u.id}
                                    {...u}
                                />
                            ),
                    )}
                </nav>
            </div>
        </div>
    )
}

export default Sidebar
