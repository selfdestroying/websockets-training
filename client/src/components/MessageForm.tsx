import { useAuth } from '@/hooks/useAuth'
import { useSocket } from '@/hooks/useSocket'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Message } from '../../../types'
import { Button } from './ui/button'
import { Form, FormField } from './ui/form'
import { Input } from './ui/input'

const formSchema = z.object({
    text: z.string().min(1),
})

const MessageForm = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            text: '',
        },
    })
    const { user } = useAuth()
    const { socket } = useSocket()
    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const message: Message = {
            text: data.text,
            createdAt: new Date().toJSON(),
            type: 'text',
            userId: user?.id as number,
            username: user?.username as string,
            clientOffset: `${socket?.id} ${Math.random().toString()}`,
        }
        socket?.emit('message', message)
        form.reset()
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                        <div className="flex gap-2 p-2 lg:gap-4">
                            <Input
                                placeholder="Type message..."
                                className="flex-1 appearance-none bg-background shadow-none"
                                {...field}
                            />
                            <Button type="submit">Send</Button>
                        </div>
                    )}
                />
            </form>
        </Form>
    )
}

export default MessageForm
