import cookieParser from 'cookie-parser'
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
import { createUser, userExists } from './db'
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
setupIO(io)
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(join(__dirname, '..', 'client')))
app.get('/', (req, res) => {
    try {
        const username = req.cookies.username
        const userId = req.cookies.userId
        if (!username || !userId) {
            return res.redirect('/login')
        }
        if (!userExists(userId, username)) {
            createUser(username)
        }
        return res.sendFile(join(__dirname, '..', 'client', 'client.html'))
    } catch (error) {
        console.log('Error on server', error)
        return res.sendStatus(500)
    }
})

app.get('/login', (req, res) => {
    const username = req.cookies.username
    const userId = req.cookies.userId
    if (username && userId) {
        return res.redirect('/')
    }
    return res.sendFile(join(__dirname, '..', 'client', 'login.html'))
})

app.post('/login', (req, res) => {
    const { username } = req.body
    if (!username) {
        return res.redirect('/login')
    }
    try {
        const userId = createUser(username)
        res.cookie('username', username)
        res.cookie('userId', userId.toString())
        return res.redirect('/')
    } catch (error) {
        return res.redirect('/login')
    }
})

server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
