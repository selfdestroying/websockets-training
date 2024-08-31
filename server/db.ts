import Database from 'better-sqlite3'
import { Message, User } from '../types'

const db = Database('../db.sqlite', {
    verbose: console.log,
})

export const dropTables = () => {
    db.exec(`DROP TABLE IF EXISTS messages`)
    db.exec(`DROP TABLE IF EXISTS users`)
}

export const createTableMessages = () => {
    db.exec(
        `CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, createdAt TEXT, type TEXT, clientOffset TEXT UNIQUE, userId INTEGER NOT NULL, FOREIGN KEY (userId) REFERENCES users(id))`,
    )
}

export const createTableUsers = () => {
    db.exec(
        `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, status TEXT)`,
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
    clientOffset,
}: Message) => {
    const query = db.prepare(
        `INSERT INTO messages (text, createdAt, type, userId, clientOffset) VALUES (?, ?, ?, ?, ?)`,
    )
    const messageId = query.run(
        text,
        createdAt,
        type,
        userId,
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

export const getMessages = (offset: number) => {
    type MessageWithUser = Message & Exclude<User, 'id'>
    const query = db.prepare<number, MessageWithUser>(
        'SELECT messages.*, users.username FROM messages LEFT JOIN users ON messages.userId = users.id WHERE messages.id > ?',
    )
    const messages = query.all(offset)
    return messages
}

export default db
