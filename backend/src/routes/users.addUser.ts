import { Request, Response, Router } from 'express';
import prisma from '../pClient';

const router = Router();

interface NewUserReqBody {
    first_name: string,
    last_name: string,
    email: string
}

router.post(`/addUser`, async (req: Request<{}, {}, NewUserReqBody>, res: Response) => {
    const { first_name, last_name, email } = req.body
    try {
        const result = await prisma.user.create({
            data: {
                email,
                first_name,
                last_name
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