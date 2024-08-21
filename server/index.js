import coockieParser from 'cookie-parser'
import express, { json, urlencoded } from 'express'
import http from 'http'
import { dirname, join } from 'path'
import { Server } from 'socket.io'
import { fileURLToPath } from 'url'
import db, { createUser } from './db.js'

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
    const username = req.cookies.username
    if (!username) {
        return res.redirect('/login')
    }
    const userExists = await db.get('SELECT id FROM users WHERE username = ?', [
        username,
    ])
    if (!userExists) {
        await createUser(username)
    }
    return res.sendFile(join(__dirname, '..', 'src', 'client.html'))
})

app.get('/login', (req, res) => {
    if (req.cookies.username) {
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
        await createUser(username)
    } catch (error) {
        console.log(error.code)
    }
    res.cookie('username', username)
    res.redirect('/')
})

io.on('connection', async (socket) => {
    io.emit('clientConnect', socket.handshake.auth.username)
    let result
    socket.on(
        'message',
        async (message, clientOffset, username, created_at, callback) => {
            try {
                const user = await db.get(
                    'SELECT id FROM users WHERE username = ?',
                    [username],
                )
                result = await db.run(
                    'INSERT INTO messages (message, created_at, type, client_offset, user_id) VALUES (?, ?, ?, ?, ?)',
                    [message, created_at, 'message', clientOffset, user.id],
                )
            } catch (error) {
                if (error.errno === 19) {
                    callback()
                }
                console.log(error)
                return
            }
            io.emit('message', message, result.lastID, username)
            callback()
        },
    )
    socket.on('disconnect', () => {
        io.emit('clientDisconnect', socket.handshake.auth.username)
    })
    if (!socket.recovered) {
        try {
            await db.each(
                'SELECT messages.id, message, created_at, username FROM messages LEFT JOIN users ON messages.user_id = users.id WHERE messages.id > ?',
                [socket.handshake.auth.serverOffset || 0],
                (_err, row) => {
                    socket.emit(
                        'message',
                        row.message,
                        row.id,
                        row.username,
                        row.created_at,
                    )
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
