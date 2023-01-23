import {Router} from 'express'
import { getStatement, postTransaction, deleteTransaction } from './../controllers/transactionController.js'
import { getUser } from '../middleware/userMiddleware.js'

const transactionRouter = Router()

transactionRouter.get('/api/statement',getUser, getStatement)

transactionRouter.post('/api/statement',getUser, postTransaction)

transactionRouter.delete('/api/statement/:id', getUser, deleteTransaction)

export default transactionRouter