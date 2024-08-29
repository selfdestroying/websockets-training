import { Button } from './components/ui/button'
import { Textarea } from './components/ui/textarea'

const Login = () => {
    return (
        <form
            method="POST"
            action="/login"
        >
            <Textarea
                name="username"
                placeholder="Type username here!"
                id="text"
            />
            <Button
                type="submit"
                id="submit"
            >
                Submit
            </Button>
        </form>
    )
}

export default Login
