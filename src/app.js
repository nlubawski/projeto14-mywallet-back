import express from 'express'
import cors from 'cors'
import authRouter from './routes/authRouter.js'
import transactionRouter from './routes/transactionRouter.js'

const app = express()
app.use(express.json())
app.use(cors())

app.use(authRouter)
app.use(transactionRouter)

const port = 4009;
app.listen(port, () => {
  console.log(`rodando na porta ${port}`)
})

