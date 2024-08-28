function debounce(func, delay) {
    let timeoutId
    return function (...args) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}
const createServiceMessage = (message) => {
    const p = document.createElement('p')
    p.classList.add('service-message')
    p.textContent = message
    messages.appendChild(p)
    messages.scrollTop = messages.scrollHeight
    setTimeout(() => {
        let start = Date.now() // remember start time
        let timer = setInterval(function () {
            // how much time passed from the start?
            let timePassed = Date.now() - start

            if (timePassed >= 1000) {
                p.remove()
                clearInterval(timer)
                return
            }

            // draw the animation at the moment timePassed

            p.style.opacity = 1 - timePassed / 1000
        }, 10)
    }, 2000)
}
const createMessage = (username, message, createdAt = new Date()) => {
    const time = new Date(createdAt).toLocaleTimeString().slice(0, -3)
    const date = new Date(createdAt).toLocaleDateString()
    const messageDiv = document.createElement('div')
    const userAndMessageDiv = document.createElement('div')
    const messageUser = document.createElement('p')
    const messageText = document.createElement('p')
    const messageTime = document.createElement('p')
    messageDiv.classList.add('message')
    messageUser.classList.add('message-user')
    messageText.classList.add('message-text')
    messageTime.classList.add('message-time')
    messageUser.textContent = username
    messageText.textContent = message
    messageTime.textContent = `${date} ${time}`

    userAndMessageDiv.appendChild(messageUser)
    userAndMessageDiv.appendChild(messageText)
    messageDiv.appendChild(userAndMessageDiv)
    messageDiv.appendChild(messageTime)

    messages.appendChild(messageDiv)
    messages.scrollTop = messages.scrollHeight

    // const p = document.createElement('p')
    // p.classList.add('message')
    // p.textContent = message
    // messages.appendChild(p)
    // messages.scrollTop = messages.scrollHeight
}
const getCookie = function (name) {
    const value = '; ' + document.cookie
    const parts = value.split('; ' + name + '=')
    if (parts.length == 2) return parts.pop().split(';').shift()
}
const form = document.querySelector('form')
const usersList = document.querySelector('#usersContainer')
const input = document.querySelector('#messageInput')
const serviceMessage = document.querySelector('#service-message')
const messages = document.querySelector('#messageContainer')
const userTyping = document.querySelector('#userTyping')
const menuButton = document.querySelector('#menuButton')
const closeButton = document.querySelector('#closeButton')
const username = getCookie('username') || ''
const userId = getCookie('userId') || ''
let counter = 0
const socket = io({
    auth: {
        serverOffset: 0,
        user: {
            id: userId,
            username: username,
        },
    },
    ackTimeout: 5000,
    retries: 3,
    // autoConnect: false,
})
menuButton.addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar')
    sidebar.classList.toggle('active')
})
closeButton.addEventListener('click', () => {
    const sidebar = document.querySelector('.sidebar')
    sidebar.classList.toggle('active')
})
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const text = input.value
    if (!text) return
    const clientOffset = `${socket.id}-${++counter}`
    const createdAt = new Date()
    const data = {
        text,
        createdAt: createdAt.toJSON(),
        type: 'text',
        clientOffset,
        userId: userId,
    }
    socket.emit('message', data)
    input.value = ''
    createMessage(username, text)
})

input.oninput = debounce(() => {
    socket.emit('stopTyping')
}, 3000)
input.addEventListener('input', (e) => {
    if (input.value.length % 2 == 0) {
        socket.emit('startTyping')
    }
})

socket.on('startTyping', (users) => {
    const usersTyping = users.filter((u) => u != username)
    if (usersTyping.length == 0) {
        userTyping.textContent = ''
        return
    }
    userTyping.textContent = `${usersTyping.join(', ')} is typing...`
})

socket.on('stopTyping', (users) => {
    const usersTyping = users.filter((u) => u != username)
    if (usersTyping.length == 0) {
        userTyping.textContent = ''
        return
    }
    userTyping.textContent = `${usersTyping.join(', ')} is typing...`
})

socket.on('clientConnect', (usersOnline) => {
    usersList.innerHTML = '<h4>Online</h4>'
    usersOnline.forEach((u) => {
        const p = document.createElement('p')
        p.classList.add('user')
        p.classList.add('online')
        p.textContent = u.username
        usersList.appendChild(p)
    })
})
socket.on('clientDisconnect', (username) => {
    const usersList = document.querySelector('#usersContainer')
    for (user of usersList.children) {
        if (user.textContent == username) {
            // user.classList.remove('online')
            user.remove()
        }
    }
})
socket.on('message', (data, offset) => {
    const { id, text, createdAt, username } = data
    socket.auth.serverOffset = id
    createMessage(username, text, createdAt)
})
