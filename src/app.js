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

const port = 5000;
app.listen(port, () => {
  console.log(`rodando na porta ${port}`)
})

