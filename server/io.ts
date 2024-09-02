import { User } from '../types'
import { createMessage, getMessages, getRooms } from './db'
import { SocketServer } from './server'

export const setupIO = (io: SocketServer) => {
    let usersTyping: string[] = []
    let usersOnline: Set<User> = new Set()
    io.on('connection', async (socket) => {
        const rooms = getRooms()
        const sockets = await io.sockets.fetchSockets()
        sockets.forEach((s) => {
            usersOnline.add(s.handshake.auth.user)
        })
        io.emit('usersOnline', Array.from(usersOnline))
        io.emit('rooms', rooms)
        socket.on('joinRoom', (currentRoom, roomId, callback) => {
            if (currentRoom) {
                socket.leave(currentRoom.toString())
            }
            socket.join(roomId.toString())
            const offset = socket.handshake.auth.serverOffset || 0
            const messages = getMessages(roomId, offset)
            console.log(socket.rooms)
            messages.forEach((m) => {
                socket.emit('message', m)
            })
            callback()
        })
        // io.except(socket.id).emit('clientConnected', socket.handshake.auth.user)

        socket.on('message', (data, callback) => {
            try {
                const newMessageId = createMessage(data)
                const newData = {
                    id: newMessageId,
                    ...data,
                }
                io.to(data.roomId.toString()).emit('message', newData)
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
            usersOnline.delete(socket.handshake.auth.user)
            // usersOnline.(
            //     (u) => u.username !== socket.handshake.auth.user.username,
            // )
            io.emit('usersOnline', Array.from(usersOnline))
        })
    })
}
