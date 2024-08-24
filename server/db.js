import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
const db = await open({
    filename: 'db.sqlite',
    driver: sqlite3.Database,
})
export const dropTables = async () => {
    await db.exec(`DROP TABLE IF EXISTS messages`)
    await db.exec(`DROP TABLE IF EXISTS users`)
}

export const createTableMessages = async () => {
    await db.exec(
        `CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT, created_at TEXT, type TEXT,  client_offset TEXT UNIQUE, user_id INTEGER NOT NULL, FOREIGN KEY (user_id) REFERENCES users(id))`,
    )
}

export const createTableUsers = async () => {
    await db.exec(
        `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, status TEXT)`,
    )
}

export const createUser = async (username) => {
    const id = (
        await db.run(`INSERT INTO users (username) VALUES (?)`, [username])
    ).lastID
    const user = await db.get(`SELECT * FROM users WHERE id = ?`, [id])
    return user
}

export const getUsers = async () => {
    const users = await db.all(`SELECT * FROM users`)
    return users
}

export default db
