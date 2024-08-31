import './App.css'
import Chat from './components/Chat'
import Sidebar from './components/Sidebar'
import { useAuth } from './hooks/useAuth'
import Login from './Login'
const App = () => {
    const { isAuthenticated } = useAuth()
    return (
        <div className="flex min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            {isAuthenticated ? (
                <>
                    <Sidebar />
                    <Chat />
                </>
            ) : (
                <Login />
            )}
        </div>
    )
}
export default App
