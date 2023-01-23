import {Router} from 'express'
import { getStatement, postTransaction } from './../controllers/transactionController.js'
import { getUser } from '../middleware/userMiddleware.js'

const transactionRouter = Router()

transactionRouter.get('/api/statement',getUser, getStatement)

transactionRouter.post('/api/statement',getUser, postTransaction)

export default transactionRouter