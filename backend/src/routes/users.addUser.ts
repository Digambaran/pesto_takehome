import { Request, Response, Router } from 'express';
import prisma from '../pClient';

const router = Router();

interface NewUserReqBody {
    password: string
    email: string
}

router.post(`/addUser`, async (req: Request<{}, {}, NewUserReqBody>, res: Response) => {
    const { password, email } = req.body
    try {
        const result = await prisma.user.create({
            data: {
                email,
                password
            }
        })
        res.json(result)
    } catch (err: any) {
        // If code is P2002, unique contraint fail, here it is email
        // let the client assume on 403, email already used
        // else send 500 for now
        if (err.code === 'P2002')
            res.status(403).send()
        else res.status(500).send()
    }
})

export default router 