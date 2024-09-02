import { User } from '../types'
import {
    createLink,
    createMessage,
    createRoom,
    getMessages,
    getRooms,
} from './db'
import { SocketServer } from './server'

export const setupIO = (io: SocketServer) => {
    let usersTyping: string[] = []
    let usersOnline: Set<User> = new Set()
    io.on('connection', async (socket) => {
        const rooms = getRooms(socket.handshake.auth.user.id)
        const sockets = await io.sockets.fetchSockets()
        sockets.forEach((s) => {
            usersOnline.add(s.handshake.auth.user)
        })
        io.emit('usersOnline', Array.from(usersOnline))
        socket.emit('rooms', rooms)
        socket.on('joinRoom', (data, callback) => {
            if (data.currentRoom) {
                socket.leave(data.currentRoom.id.toString())
            }
            socket.join(data.roomToJoin.id.toString())
            const offset = socket.handshake.auth.serverOffset || 0
            const messages = getMessages(data.roomToJoin.id, offset)
            messages.forEach((m) => {
                socket.emit('message', m)
            })
            callback()
        })
        socket.on('createRoom', (data, callback) => {
            const name = [
                data.user.username,
                socket.handshake.auth.user.username,
            ]
                ?.sort()
                ?.join('-')
            const roomId = createRoom(name, data.type)
            createLink(socket.handshake.auth.user.id, data.user.id, roomId)

            if (data.currentRoom) {
                socket.leave(data.currentRoom.id.toString())
            }
            socket.join(roomId.toString())
            socket.emit('createRoom', {
                id: roomId,
                name,
                type: data.type,
            })
            callback()
        })
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
            io.emit('usersOnline', Array.from(usersOnline))
        })
    })
    io.of('/').adapter.on('create-room', (room) => {
        console.log(`room ${room} was created`)
    })
}
