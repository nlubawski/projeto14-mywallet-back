import express from 'express'
import {MongoClient} from 'mongodb'
import dotenv from 'dotenv'
import cors from 'cors'
import joi from 'joi'
import dayjs from 'dayjs'
import bcrypt from 'bcrypt'
import {v4 as uuid} from 'uuid'

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

console.log("aqui")
app.post('/api/sing-up', async(req,res) => {
  console.log("aqui dentro 1")

  const {name, email, password, confirmPassord} = req.body
  console.log("aqui dentro 1")

  try {
    const user = await db.collection('users').findOne({email})
    if(user){
      alert('email já cadastrado')
      return res.sendStatus(400)
    }
    const SALT = 10
    const hash = bcrypt.hashSync(password,SALT)
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



const port = 5000;
app.listen(port, () => {
  console.log(`rodando na porta ${port}`)
})

