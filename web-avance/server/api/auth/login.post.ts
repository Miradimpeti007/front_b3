import fs from 'node:fs/promises'
import path from 'node:path'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const dbPath = path.resolve('server/db.json')
  
  const data = await fs.readFile(dbPath, 'utf-8')
  const db = JSON.parse(data)

  const user = db.users.find((u: any) => u.username === body.username)
  if (!user || !(await bcrypt.compare(body.password, user.password))) {
    throw createError({ statusCode: 401, statusMessage: 'Identifiants invalides' })
  }

  // 1. Génération des Jetons avec les variables du .env
  const accessToken = jwt.sign(
    { userId: user.id }, 
    process.env.JWT_ACCESS_SECRET!, 
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN }
  )
  const refreshToken = jwt.sign(
    { userId: user.id }, 
    process.env.JWT_REFRESH_SECRET!, 
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  )

  // 2. Sauvegarde du refresh token
  user.refreshTokens.push(refreshToken)
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2))

  // 3. Cookies avec durées dynamiques
  setCookie(event, 'auth_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: parseInt(process.env.COOKIE_ACCESS_MAX_AGE || '900'),
    sameSite: 'lax'
  })

  setCookie(event, 'refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: parseInt(process.env.COOKIE_REFRESH_MAX_AGE || '604800'),
    sameSite: 'lax'
  })

  return {
    user: {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      level: user.level,
      xp: user.xp
    }
  }
})