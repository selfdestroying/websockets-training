import { User } from '../types'
import { createMessage, getMessages } from './db'
import { SocketServer } from './server'

export const setupIO = (io: SocketServer) => {
    // dropTables()
    // createTableUsers()
    // createTableMessages()
    const usersTyping: string[] = []
    io.on('connection', async (socket) => {
        const sockets = await io.sockets.fetchSockets()
        const usersOnline: User[] = []
        sockets.forEach((s) => {
            usersOnline.push(s.handshake.auth.user)
        })
        io.emit('clientConnect', usersOnline)
        socket.on('message', (data, callback) => {
            try {
                const newMessageId = createMessage(data)
                const newData = {
                    id: newMessageId,
                    username: socket.handshake.auth.user.username,
                    ...data,
                }
                io.except(socket.id).emit('message', newData, newMessageId)
                callback()
            } catch (error: any) {
                if (error.errno === 19) {
                    console.log(error)
                    callback()
                }
                console.log(error)
                return
            }
        })
        socket.on('startTyping', (callback) => {
            if (!usersTyping.includes(socket.handshake.auth.user.username)) {
                usersTyping.push(socket.handshake.auth.user.username)
            }
            io.emit('startTyping', usersTyping)
            callback()
        })
        socket.on('stopTyping', (callback) => {
            usersTyping.splice(
                usersTyping.indexOf(socket.handshake.auth.user.username),
                1,
            )
            io.emit('stopTyping', usersTyping)
            callback()
        })
        socket.on('disconnect', () => {
            io.emit('clientDisconnect', socket.handshake.auth.user.username)
        })
        if (!socket.recovered) {
            try {
                const offset = socket.handshake.auth.serverOffset || 0
                const messages = getMessages(offset)
                messages.forEach((m) => {
                    socket.emit('message', m, m.id)
                })
            } catch (error) {
                console.log(error)
                return
            }
        }
    })
}
