const usernameField = document.querySelector('#username-field')
const form = document.querySelector('form')
const input = document.querySelector('input')
const serviceMessage = document.querySelector('#service-message')
const messages = document.querySelector('#messages')
const getCookie = function (name) {
    const value = '; ' + document.cookie
    const parts = value.split('; ' + name + '=')
    if (parts.length == 2) return parts.pop().split(';').shift()
}

const username = getCookie('username') || ''
usernameField.textContent = `Hello ${username}`

let counter = 0
const socket = io({
    auth: {
        serverOffset: 0,
        username: username,
    },
    ackTimeout: 5000,
    retries: 3,
    // autoConnect: false,
})

const createMessage = (message) => {
    const li = document.createElement('li')
    li.textContent = message
    messages.appendChild(li)
}

socket.on('connect', () => {})

socket.on('clientConnect', (newUsername) => {
    if (newUsername == username) {
        return
    }
    createMessage(`${newUsername} connected`)
})
socket.on('clientDisconnect', (newUsername) => {
    if (newUsername == username) {
        return
    }
    createMessage(`${newUsername} disconnected`)
})
socket.on('message', (message, serverOffset, username, created_at) => {
    createMessage(`${username}: ${message} - ${created_at}`)
    socket.auth.serverOffset = serverOffset
    window.scrollTo(0, document.body.scrollHeight)
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const message = input.value
    if (!message) return
    const clientOffset = `${socket.id}-${++counter}`
    const created_at = new Date().toJSON()
    socket.emit('message', message, clientOffset, username, created_at)
    input.value = ''
})
