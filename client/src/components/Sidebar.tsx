import { useAuth } from '@/hooks/useAuth'
import useSidebar from '@/hooks/useSidebar'
import { MessageCircleMoreIcon, X } from 'lucide-react'
import { FC } from 'react'
import { Button } from './ui/button'

const Sidebar: FC = () => {
    const { sidebarRef, showSidebar, setShowSidebar } = useSidebar()
    const { user } = useAuth()
    return (
        <div
            className={`border-r max-w-64 w-full h-full fixed sidebar bg-white transition-all duration-300 ease-in-out ${
                showSidebar ? 'active' : ''
            }`}
            ref={sidebarRef}
        >
            <div className="flex flex-col">
                <header className="flex justify-between items-center border-b bg-muted/40 p-2 gap-2 md:hidden">
                    <p>{user?.username}</p>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 w-fit h-fit p-2"
                        onClick={() => setShowSidebar(!showSidebar)}
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </header>
                <div className="flex-1 border-b">
                    <div className="flex p-2 items-center justify-between border-b">
                        <h1 className="text-lg font-semibold">Users</h1>
                    </div>
                    <nav className="flex flex-col gap-2 p-2 text-sm font-medium">
                        <div className="flex justify-between items-center border p-2 rounded-lg">
                            <p className="online">@nextjs</p>
                            <Button
                                variant="outline"
                                size={'icon'}
                                className="p-2 w-fit h-fit text-muted-foreground transition-all hover:text-primary"
                            >
                                <MessageCircleMoreIcon className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex justify-between items-center border p-2 rounded-lg">
                            <p className="online">@nextjs</p>
                            <Button
                                variant="outline"
                                size={'icon'}
                                className="p-2 w-fit h-fit text-muted-foreground transition-all hover:text-primary"
                            >
                                <MessageCircleMoreIcon className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex justify-between items-center border p-2 rounded-lg">
                            <p className="online">@nextjs</p>
                            <Button
                                variant="outline"
                                size={'icon'}
                                className="p-2 w-fit h-fit text-muted-foreground transition-all hover:text-primary"
                            >
                                <MessageCircleMoreIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </nav>
                </div>
                <div className="flex-1 border-b">
                    <div className="flex p-2 items-center justify-between border-b">
                        <h1 className="text-lg font-semibold">Users</h1>
                    </div>
                    <nav className="flex flex-col gap-2 p-2 text-sm font-medium">
                        <div className="flex justify-between items-center border p-2 rounded-lg">
                            <p className="online">@nextjs</p>
                            <Button
                                variant="outline"
                                size={'icon'}
                                className="p-2 w-fit h-fit text-muted-foreground transition-all hover:text-primary"
                            >
                                <MessageCircleMoreIcon className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex justify-between items-center border p-2 rounded-lg">
                            <p className="online">@nextjs</p>
                            <Button
                                variant="outline"
                                size={'icon'}
                                className="p-2 w-fit h-fit text-muted-foreground transition-all hover:text-primary"
                            >
                                <MessageCircleMoreIcon className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex justify-between items-center border p-2 rounded-lg">
                            <p className="online">@nextjs</p>
                            <Button
                                variant="outline"
                                size={'icon'}
                                className="p-2 w-fit h-fit text-muted-foreground transition-all hover:text-primary"
                            >
                                <MessageCircleMoreIcon className="h-4 w-4" />
                            </Button>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
