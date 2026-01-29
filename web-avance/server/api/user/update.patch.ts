import { readBody, createError, defineEventHandler, getCookie } from 'h3'
import fs from 'node:fs/promises'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const userId = event.context.auth?.id

  if (!userId) {
    throw createError({ statusCode: 401, message: 'Session invalide ou expirée' })
  }

  const dbPath = path.resolve(process.cwd(), 'db.json')
  const dbData = JSON.parse(await fs.readFile(dbPath, 'utf-8'))
  const userIndex = dbData.users.findIndex((u: any) => u.id === userId)

  if (userIndex === -1) {
    throw createError({ statusCode: 404, message: 'Utilisateur introuvable' })
  }

  // Mise à jour sélective : on ne touche pas au mot de passe ni à l'XP
  const updatedUser = {
    ...dbData.users[userIndex],
    username: body.username || dbData.users[userIndex].username,
    firstName: body.firstName || dbData.users[userIndex].firstName,
    lastName: body.lastName || dbData.users[userIndex].lastName,
    avatar: body.avatar || dbData.users[userIndex].avatar,
    householdCount: body.householdCount || dbData.users[userIndex].householdCount
  }

  dbData.users[userIndex] = updatedUser
  await fs.writeFile(dbPath, JSON.stringify(dbData, null, 2))

  return { 
    success: true, 
    user: updatedUser 
  }
})