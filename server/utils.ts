export const onMessage = async (socket, data, callback) => {
    try {
        const { message, clientOffset, created_at, type } = data
        const user = socket.handshake.auth.user
        const result = await db.run(
            'INSERT INTO messages (message, created_at, type, client_offset, user_id) VALUES (?, ?, ?, ?, ?)',
            [message, created_at, type, clientOffset, user.id],
        )
        const newData = {
            serverOffset: result.lastID,
            message,
            sender: user.username,
            created_at,
        }
        io.except(socket.id).emit('message', newData)
        callback()
    } catch (error) {
        if (error.errno === 19) {
            callback()
        }
        console.log(error)
    }
}
