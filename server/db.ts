import Database from 'better-sqlite3'
import { Message, Room, User } from '../types'

const db = Database('../db.sqlite', {
    verbose: console.log,
})

export const setupDatabase = () => {
    createTableUsers()
    createTableRooms()
    createTableMessages()
    createTableRoomsUsers()
    try {
        createRoom('general', 'public')
    } catch {
        console.log('Room "general" already exists')
    }
    try {
        createRoom('games', 'public')
    } catch {
        console.log('Room "games" already exists')
    }
}

export const dropTables = () => {
    db.exec(`DROP TABLE IF EXISTS messages`)
    db.exec(`DROP TABLE IF EXISTS users`)
    db.exec(`DROP TABLE IF EXISTS rooms`)
    db.exec('DROP TABLE IF EXISTS rooms_users')
}

export const createTableMessages = () => {
    db.exec(
        `CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, createdAt TEXT, type TEXT, clientOffset TEXT UNIQUE, userId INTEGER NOT NULL, roomId INTEGER NOT NULL, FOREIGN KEY (userId) REFERENCES users(id), FOREIGN KEY (roomId) REFERENCES rooms(id))`,
    )
}

export const createTableRooms = () => {
    db.exec(
        `CREATE TABLE IF NOT EXISTS rooms (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, type TEXT)`,
    )
}

export const createTableUsers = () => {
    db.exec(
        `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, status TEXT)`,
    )
}

export const createTableRoomsUsers = () => {
    db.exec(
        'CREATE TABLE IF NOT EXISTS rooms_users (roomId INTEGER NOT NULL, userId INTEGER NOT NULL, FOREIGN KEY (roomId) REFERENCES rooms(id), FOREIGN KEY (userId) REFERENCES users(id))',
    )
}

export const createUser = (username: string, password: string) => {
    const query = db.prepare<string[], User>(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
    )
    const userId = query.run(username, password).lastInsertRowid
    return userId
}

export const createMessage = ({
    text,
    createdAt,
    type,
    userId,
    roomId,
    clientOffset,
}: Message) => {
    const query = db.prepare(
        `INSERT INTO messages (text, createdAt, type, userId, roomId, clientOffset) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    const messageId = query.run(
        text,
        createdAt,
        type,
        userId,
        roomId,
        clientOffset,
    ).lastInsertRowid
    return messageId
}

export const getUsers = () => {
    const query = db.prepare<unknown[], User>(`SELECT * FROM users`)
    const users = query.all()
    return users
}

export const getUser = (username: string) => {
    const query = db.prepare<string[], User>(
        `SELECT * FROM users WHERE username = ?`,
    )
    const user = query.get(username)
    return user
}

export const getMessages = (roomId: number | bigint, offset: number) => {
    type MessageWithUser = Message & Exclude<User, 'id'>
    const query = db.prepare<[number, number | bigint], MessageWithUser>(
        'SELECT messages.*, users.username FROM messages LEFT JOIN users ON messages.userId = users.id WHERE messages.id > ? AND messages.roomId = ?',
    )
    const messages = query.all(offset, roomId)
    return messages
}

export const getRooms = (userId?: number) => {
    if (userId) {
        const query = db.prepare<number, Room>(
            "SELECT rooms.* FROM rooms LEFT JOIN rooms_users ON rooms_users.roomId = rooms.id WHERE rooms_users.userId = ? OR rooms.type = 'public'",
        )
        const rooms = query.all(userId)
        return rooms
    } else {
        const query = db.prepare<unknown[], Room>(
            `SELECT * FROM rooms WHERE type = 'public'`,
        )
        const rooms = query.all()
        return rooms
    }
}

export const createRoom = (name: string, type: string) => {
    try {
        const query = db.prepare<string[], Room>(
            'INSERT INTO rooms (name, type) VALUES (?, ?)',
        )
        const roomId = query.run(name, type).lastInsertRowid
        return roomId
    } catch {
        const query = db.prepare<string, Room>(
            'SELECT * FROM rooms WHERE name = ?',
        )
        const room = query.get(name)
        return room?.id as number | bigint
    }
}

export const createLink = (
    userId1: number,
    userId2: number,
    roomId: number | bigint,
) => {
    const query1 = db.prepare(
        'SELECT * FROM rooms_users WHERE userId = ? AND roomId = ?',
    )
    const link = query1.get(userId1, roomId)
    if (!link) {
        const query2 = db.prepare<[number, number | bigint], unknown>(
            'INSERT INTO rooms_users (userId, roomId) VALUES (?, ?)',
        )
        query2.run(userId1, roomId)
        query2.run(userId2, roomId)
        return true
    }
    return false
}

export default db
