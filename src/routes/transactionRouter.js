import {Router} from 'express'
import { getStatement, postTransaction, deleteTransaction, editTransaction } from './../controllers/transactionController.js'
import { getUser } from '../middleware/userMiddleware.js'

const transactionRouter = Router()

transactionRouter.get('/api/statement',getUser, getStatement)

transactionRouter.post('/api/statement',getUser, postTransaction)

transactionRouter.delete('/api/statement/:id', getUser, deleteTransaction)

transactionRouter.put('/api/statement/:id', getUser, editTransaction)

export default transactionRouter