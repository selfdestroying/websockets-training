import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { json, urlencoded } from 'express'
import { createServer } from 'http'
import { join } from 'path'
import { Server } from 'socket.io'
import {
    ClientToServerEvents,
    InterServerEvents,
    ServerToClientEvents,
    SocketData,
} from '../types'
import { createUser, getUser } from './db'
import { setupIO } from './io'
export type SocketServer = Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>

const port = process.env.PORT || 3000

const app = express()
const server = createServer(app)
const io = new Server<SocketServer>(server, {
    connectionStateRecovery: {},
    cors: {
        origin: 'http://localhost:5173',
    },
})
// dropTables()
// createTableUsers()
// createTableMessages()
setupIO(io)
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(join(__dirname, '..', 'client')))

app.post('/login', (req, res) => {
    const { username, password } = req.body
    try {
        const user = getUser(username)
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        if (user.password === password) {
            return res.status(200).json({ id: user.id, username })
        }
        return res.status(401).json({ error: 'Invalid credentials' })
    } catch {
        return res.status(500).json({ error: 'Internal server error' })
    }
})

app.post('/register', (req, res) => {
    const { username, password } = req.body
    try {
        const id = createUser(username, password)
        return res.status(200).json({ id, username })
    } catch (error: any) {
        return res.status(500).json({ error: error.message })
    }
})

server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
