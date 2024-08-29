import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader } from './ui/card'

export function UserCard() {
    return (
        <Card className="flex justify-between items-center p-4">
            <CardHeader className="p-0">
                <p>@nextjs</p>
            </CardHeader>
            <CardFooter className="p-0">
                <Button>Private Message</Button>
            </CardFooter>
        </Card>
    )
}
