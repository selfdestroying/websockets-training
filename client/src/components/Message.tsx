import { FC } from 'react'
import { type Message } from '../../../types'

const Message: FC<Message> = ({ id, username, text, createdAt }) => {
    const formattedDate = new Date(createdAt).toTimeString().slice(0, 5)
    return (
        <div
            className="flex flex-row justify-between border p-2 gap-2 rounded-lg"
            key={id}
        >
            <div className="flex flex-col gap-2 flex-1">
                <p className="font-bold border-b">{username}</p>
                <p>{text}</p>
            </div>
            <p className="text-gray-500">{formattedDate}</p>
        </div>
    )
}

export default Message
