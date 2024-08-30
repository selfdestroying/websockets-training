import './App.css'
import Chat from './components/Chat'
import Sidebar from './components/Sidebar'
const App = () => {
    return (
        <div className="flex min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <Chat />
        </div>
    )
}
export default App
