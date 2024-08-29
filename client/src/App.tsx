import { Menu, MessageCircleMoreIcon, X } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'
import { useEffect, useRef, useState } from 'react'
import './App.css'
const App = () => {
    const [showSidebar, setShowSidebar] = useState(false)
    const sidebarRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(e.target as Node)
            ) {
                setShowSidebar(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [sidebarRef])
    return (
        <div className="flex min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div
                className={`border-r max-w-64 w-full h-full fixed sidebar bg-white transition-all duration-300 ease-in-out ${
                    showSidebar ? 'active' : ''
                }`}
                ref={sidebarRef}
            >
                <div className="flex flex-col">
                    <header className="flex justify-end items-center border-b bg-muted/40 p-2 gap-2 md:hidden">
                        <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0 w-fit h-fit p-2"
                            onClick={() => setShowSidebar(!showSidebar)}
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">
                                Toggle navigation menu
                            </span>
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
        </div>
    )
}
export default App
