import db from './../dataBase/db.js'
import transactionSchema from './../schemas/transactionSchema.js'
import dayjs from 'dayjs'

export async function getStatement(req, res){
  const {user} = res.locals 
  try {
    const statement = await db.collection('statements').find({ userId: user._id }).toArray()
    return res.send(statement)
  } catch (error) {
    return res.sendStatus(500)
  }
}

export async function postTransaction(req, res){
  const { type, description, value } = req.body
  try {
    await transactionSchema.validateAsync({
      type,
      description,
      value
    }, { abortEarly: false })
  } catch (error) {
    return res.status(422).send('Erro ao preencher transacao')
  }

  const {user} = res.locals
  try {
    await db.collection('statements').insertOne({
      type,
      value,
      description,
      userId: user._id,
      date: dayjs().format("DD/MM")
    })
    return res.sendStatus(201)
  } catch (error) {
    return res.sendStatus(500)
  }
}