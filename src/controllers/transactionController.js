import db from './../dataBase/db.js'

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
  const {user} = res.locals
  try {
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
}