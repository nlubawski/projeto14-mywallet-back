import db from './../dataBase/db.js'

export async function getUser(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer', '').trim()
  
  if (!token) return res.status(401).send('No token')
  try {
    const session = await db.collection('sessions').findOne({ token })
    if (!session) return res.status(401).send('No active session')

    const user = await db.collection('users').findOne({ _id: session.userId })
    if (!user) return res.status(401).send('No user')

    res.locals.user = user;
    next();
  } catch (error) {
    return res.sendStatus(500);
  }
}