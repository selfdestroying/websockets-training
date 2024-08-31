import {
    createContext,
    FC,
    ReactNode,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'

interface ISidebarContext {
    sidebarRef: React.RefObject<HTMLDivElement>
    showSidebar: boolean
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>
}

interface SidebarProviderProps {
    children: ReactNode
}

export const SidebarContext = createContext<ISidebarContext | null>(null)

export const SidebarProvider: FC<SidebarProviderProps> = ({ children }) => {
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

    const value = useMemo(
        () => ({ sidebarRef, showSidebar, setShowSidebar }),
        [showSidebar],
    )

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    )
}
