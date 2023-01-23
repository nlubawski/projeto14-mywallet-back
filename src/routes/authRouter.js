import {Router} from 'express'
import { signIn, signUp } from '../controllers/authController.js'

const authRouter = Router()

authRouter.post('/api/sign-up', signUp)

authRouter.post('/api/sign-in', signIn)

export default authRouter