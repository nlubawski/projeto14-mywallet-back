import express, { application } from 'express'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import cors from 'cors'
import joi from 'joi'
import dayjs from 'dayjs'
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

dotenv.config()
const mongoClient = new MongoClient(process.env.DATABASE_URL)

let db;
try {
  await mongoClient.connect()
  db = mongoClient.db()
  console.log("deu bom")
} catch (error) {
  console.error(error)
}

const app = express()
app.use(express.json())
app.use(cors())

const signUpSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  confirmPassword: joi.ref('password')
})

const signInSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required()
})

const transactionSchema = joi.object({
  type: joi.string().required(),
  description: joi.string().required(),
  value: joi.number().required()
});

app.post('/api/sign-up', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  try {
    await signUpSchema.validateAsync({
      name,
      email,
      password,
      confirmPassword
    }, { abortEarly: false })
  } catch (error) {
    return res.status(422).send('Erro ao preencher cadastro')
  }
  try {
    const user = await db.collection('users').findOne({ email })
    if (user) {
      console.error('email já cadastrado')
      return res.sendStatus(400)
    }
    const SALT = 10
    const hash = bcrypt.hashSync(password, SALT)
    await db.collection('users').insertOne({
      name,
      email,
      password: hash
    })
    return res.sendStatus(201)

  } catch (error) {
    console.error('erro', error)
    return res.sendStatus(500)
  }
})

app.post('/api/sign-in', async (req, res) => {
  const { email, password } = req.body
  try {
    await signInSchema.validateAsync({
      email,
      password
    }, { abortEarly: false })
  } catch (error) {
    return res.status(422).send('Usuário ou email inválido')
  }

  try {
    const user = await db.collection('users').findOne({ email })
    console.log("user", user)
    if (!user) return res.sendStatus(404)
    console.log("cheguei aqui eee")

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid()
      await db.collection('sessions').insertOne({
        token,
        userId: user._id
      })
      const data = {
        token,
        name: user.name,
        userId: user._id
      }
      return res.send(data);
    }
    return res.sendStatus(200)
  } catch (error) {
    res.sendStatus(500)
  }
})

app.get('/api/statement', async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer', '').trim()

  if (!token) return res.status(401).send('No session')
  try {
    const session = await db.collection('sessions').findOne({ token })
    if (!session) return res.status(401).send('No active session')

    const user = await db.collection('users').findOne({ _id: session.userId })
    if (!user) return res.status(401).send('No user')

    const statement = await db.collection('statements').find({ userId: user._id }).toArray()
    console.log("statement aqui")
    return res.send(statement)

  } catch (error) {
    return res.sendStatus(500)
  }
})

app.post('/api/statement', async (req, res) => {
  const { authorization } = req.headers
  const { type, description, value } = req.body
  const token = authorization?.replace('Bearer', '').trim()
  if (!token) return res.status(401).send("No token.")

  try {
    const session = await db.collection('sessions').findOne({ token })
    if (!session) return res.status(401).send('No active session')

    const user = await db.collection('users').findOne({ _id: session.userId })
    if (!user) return res.status(401).send('No user')

    await db.collection('statements').insertOne({
      type,
      value,
      description,
      userId: user._id
    })
    return res.sendStatus(201)
  } catch (error) {
    return res.sendStatus(500)
  }


})

const port = 4009;
app.listen(port, () => {
  console.log(`rodando na porta ${port}`)
})

