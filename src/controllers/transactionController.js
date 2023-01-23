import db from './../dataBase/db.js'

export async function getStatement(req, res){
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
}

export async function postTransaction(req, res){
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
}