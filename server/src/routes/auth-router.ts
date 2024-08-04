import { Router, Request } from 'express'
import prisma from '../db/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = Router()
const secret = process.env.SECRET || ''

interface signupRequest extends Request {
  body: {
    name: string
    email: string
    password: string
  }
}
interface loginRequest extends Request {
  body: {
    email: string
    password: string
  }
}

router.post('/signup', async (req: signupRequest, res) => {
  try {
    const { email, name, password } = req.body
    if (!email || !name || !password) {
      return res.status(400).json({ message: 'All fields not provided' })
    }

    const userCount = await prisma.users.count({ where: { email: email } })
    if (userCount > 0) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await prisma.users.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    })

    const token = jwt.sign({ id: user.id }, secret)
    res.status(201).json({ token: token })
  } catch (err) {
    console.log('==signup==\n', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.post('/login', async (req: loginRequest, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields not provided' })
    }

    const user = await prisma.users.findUnique({ where: { email: email } })
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid password' })
    }

    const token = jwt.sign({ id: user.id }, secret)
    res.status(201).json({ token: token })
  } catch (err) {
    console.log('==login==\n', err)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
