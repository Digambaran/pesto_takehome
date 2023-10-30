import { Request, Response, Router } from 'express';
// import prisma from '../pClient';

const router = Router();

interface ChangeUserReqBody {
    email: string,
    password: string
}

router.post(`/changeUser`, async (req: Request<{}, {}, ChangeUserReqBody>, res: Response) => {
    const { email, password } = req.body
    try {
        console.log({ email, password })
        /**
         * TODO:
         * - Check if user exists
         * - If exists, set cookie with new user
         * - send user specific todos
         * - if no user or wrong password, send "Nop! I dont' know you"
         */
    } catch (err: any) {

    }
})

export default router 