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
const createMessage = (username, message, created_at) => {
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
    messageTime.textContent = created_at

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

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const message = input.value
    if (!message) return
    const clientOffset = `${socket.id}-${++counter}`
    const created_at = new Date().toJSON()
    const data = {
        message,
        clientOffset,
        created_at,
        type: 'message',
    }
    socket.emit('message', data)
    input.value = ''
    createMessage(username, message, created_at)
})

input.oninput = debounce(() => {
    socket.emit('stopTyping')
}, 3000)
input.addEventListener('input', (e) => {
    if (input.value.length % 2 == 0) {
        socket.emit('startTyping')
    }
})

socket.on('startTyping', (username) => {
    userTyping.textContent = `${username} is typing...`
})

socket.on('stopTyping', () => {
    userTyping.textContent = ''
})

socket.on('clientConnect', (data) => {
    const { user, users } = data
    usersList.innerHTML = '<h3>Users</h3>'
    users.forEach((u) => {
        const p = document.createElement('p')
        p.classList.add('user')
        p.classList.add('online')
        // if (usersOnline.includes(u.username)) {
        // p.classList.add('online')
        // }

        p.textContent = u.username
        usersList.appendChild(p)
    })
    if (user.username == username) {
        return
    }
    createServiceMessage(`${user.username} connected`)
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
socket.on('message', (data) => {
    const { message, serverOffset, created_at, sender } = data
    const time = new Date(created_at).toLocaleTimeString().slice(0, -3)
    const date = new Date(created_at).toLocaleDateString()
    createMessage(sender, message, `${date} ${time}`)
    socket.auth.serverOffset = serverOffset
})
