import {Router} from 'express'
import { getStatement, postTransaction } from './../controllers/transactionController.js'

const transactionRouter = Router()

transactionRouter.get('/api/statement', getStatement)

transactionRouter.post('/api/statement', postTransaction)

export default transactionRouter