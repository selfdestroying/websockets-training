import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-label'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from './components/ui/card'
import { Form, FormField, FormItem, FormMessage } from './components/ui/form'
import { Input } from './components/ui/input'
import { useAuth } from './hooks/useAuth'

const formSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(3),
})

const Login = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    })
    const { login, register } = useAuth()
    const onLoginSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await login(data)
        } catch (error) {
            if (error instanceof Error) {
                form.setError('root', { message: error.message })
            }
        }
    }
    const onRegisterSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            await register(data)
        } catch (error) {
            if (error instanceof Error) {
                form.setError('root', { message: error.message })
            }
        }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <Form {...form}>
                    <form
                        className="grid gap-4"
                        id="auth"
                    >
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        type="text"
                                        {...field}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        {...field}
                                    />
                                </FormItem>
                            )}
                        />
                    </form>
                    <FormMessage>
                        {form.formState.errors.root?.message}
                    </FormMessage>
                </Form>
            </CardContent>
            <CardFooter className="flex gap-2 flex-col md:flex-row">
                <Button
                    className="w-full"
                    variant="outline"
                    onClick={form.handleSubmit(onRegisterSubmit)}
                >
                    Sign up
                </Button>
                <Button
                    className="w-full"
                    onClick={form.handleSubmit(onLoginSubmit)}
                >
                    Sign in
                </Button>
            </CardFooter>
        </Card>
    )
}

export default Login
