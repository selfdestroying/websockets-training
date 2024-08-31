import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './prodivers/AuthProvider.tsx'
import { SidebarProvider } from './prodivers/SidebarProvider.tsx'
import { SocketProvider } from './prodivers/SocketProvider.tsx'
import { ThemeProvider } from './prodivers/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <SocketProvider>
                <ThemeProvider
                    defaultTheme="light"
                    storageKey="vite-ui-theme"
                >
                    <SidebarProvider>
                        <App />
                    </SidebarProvider>
                </ThemeProvider>
            </SocketProvider>
        </AuthProvider>
    </StrictMode>,
)
