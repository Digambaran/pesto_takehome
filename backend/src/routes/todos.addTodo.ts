import { Request, Response, Router } from 'express';
import prisma from '../pClient';

const router = Router();

interface AddTodoRequestBody {
    title: string,
    description: string,
    status: 't' | 'p' | 'd'
}

router.post(`/addTodo`, async (req: Request<{}, {}, AddTodoRequestBody>, res: Response) => {
    const { title, description, status } = req.body
    try {
        const result = await prisma.user.create({
            data: {

            },
        })
        res.json(result)
    } catch (err: any) {
        // If code is P2002, unique contraint fail, here it is email
        // let the client assume on 403, email already used
        res.status(403).send()
    }
})

export default router 