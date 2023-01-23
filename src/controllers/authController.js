import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import db from './../dataBase/db.js'

export async function signUp(req,res){
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
}

export async function signIn (req, res){
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
    if (!user) return res.sendStatus(404)

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
}

