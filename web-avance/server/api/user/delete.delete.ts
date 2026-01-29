import { createError, defineEventHandler, deleteCookie } from 'h3'
import fs from 'node:fs/promises'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const userId = event.context.auth?.id

  if (!userId) {
    throw createError({ statusCode: 401, message: 'Action interdite' })
  }

  const dbPath = path.resolve(process.cwd(), 'db.json')
  const dbData = JSON.parse(await fs.readFile(dbPath, 'utf-8'))
  
  // On filtre pour enlever l'utilisateur
  const initialCount = dbData.users.length
  dbData.users = dbData.users.filter((u: any) => u.id !== userId)

  if (dbData.users.length === initialCount) {
    throw createError({ statusCode: 404, message: 'Utilisateur introuvable' })
  }

  await fs.writeFile(dbPath, JSON.stringify(dbData, null, 2))

  // Destruction de la session
  deleteCookie(event, 'auth_token')
  deleteCookie(event, 'refresh_token')

  return { success: true, message: 'Compte supprimé' }
})