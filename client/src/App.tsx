import { useEffect } from 'react'
import './App.css'
import Chat from './components/Chat'
import Sidebar from './components/Sidebar'
import { useAuth } from './hooks/useAuth'
import { useSocket } from './hooks/useSocket'
import Login from './Login'
const App = () => {
    const { isAuthenticated } = useAuth()
    const { socket } = useSocket()
    useEffect(() => {
        if (socket) {
            socket.connect()
        }
    }, [socket])
    return (
        <>
            {isAuthenticated ? (
                <div className="flex w-full h-full">
                    <Sidebar />
                    <Chat />
                </div>
            ) : (
                <div className="flex justify-center items-center w-full h-full">
                    <Login />
                </div>
            )}
        </>
    )
}
export default App
