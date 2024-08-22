import coockieParser from 'cookie-parser'
import express, { json, urlencoded } from 'express'
import http from 'http'
import { dirname, join } from 'path'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'
import db, { createUser, getUsers } from './db.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    connectionStateRecovery: {},
})

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(json())
app.use(urlencoded({ extended: true }))
app.use(coockieParser())
app.use(express.static(join(__dirname, '..', 'src')))
app.get('/', async (req, res) => {
    try {
        const username = req.cookies.username
        const userId = req.cookies.userId
        if (!username || !userId) {
            return res.redirect('/login')
        }
        const user = {
            id: userId,
            username,
        }

        const userExists = await db.get(
            'SELECT id FROM users WHERE username = ?',
            [user.username],
        )
        if (!userExists) {
            await createUser(user.username)
        }
        return res.sendFile(join(__dirname, '..', 'src', 'client.html'))
    } catch (error) {
        console.log('Error on server (37)', error)
        return res.sendStatus(500)
    }
})

app.get('/login', (req, res) => {
    const username = req.cookies.username
    const userId = req.cookies.userId
    if (username && userId) {
        return res.redirect('/')
    }
    res.sendFile(join(__dirname, '..', 'src', 'login.html'))
})

app.post('/login', async (req, res) => {
    const { username } = req.body
    if (!username) {
        return res.redirect('/login')
    }
    try {
        const user = await createUser(username)
        res.cookie('username', user.username)
        res.cookie('userId', user.id)
        res.redirect('/')
    } catch (error) {
        console.log(error.code)
        res.redirect('/login')
    }
})

io.on('connection', async (socket) => {
    const users = await getUsers()
    const data = {
        user: socket.handshake.auth.user,
        users,
    }
    console.log(data)
    io.emit('clientConnect', data)
    let result
    socket.on('message', async (data, callback) => {
        try {
            const { message, clientOffset, created_at, type } = data
            const user = socket.handshake.auth.user
            result = await db.run(
                'INSERT INTO messages (message, created_at, type, client_offset, user_id) VALUES (?, ?, ?, ?, ?)',
                [message, created_at, type, clientOffset, user.id],
            )
            const newData = {
                serverOffset: result.lastID,
                message,
                sender: user.username,
                created_at,
            }
            io.emit('message', newData)
            callback()
        } catch (error) {
            if (error.errno === 19) {
                callback()
            }
            console.log(error)
        }
    })
    socket.on('disconnect', () => {
        io.emit('clientDisconnect', socket.handshake.auth.username)
    })
    if (!socket.recovered) {
        try {
            await db.each(
                'SELECT messages.id, message, created_at, username FROM messages LEFT JOIN users ON messages.user_id = users.id WHERE messages.id > ?',
                [socket.handshake.auth.serverOffset || 0],
                (_err, row) => {
                    const newData = {
                        serverOffset: row.id,
                        message: row.message,
                        sender: row.username,
                        created_at: row.created_at,
                    }
                    socket.emit('message', newData)
                },
            )
        } catch (error) {
            console.log(error)
            return
        }
    }
})
const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
