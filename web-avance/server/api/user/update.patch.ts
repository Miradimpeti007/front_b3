import fs from 'node:fs/promises'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const userId = event.context.auth?.userId // Utilise bien .userId suite au correctif du middleware

    if (!userId) {
      throw createError({ statusCode: 401, statusMessage: 'Session invalide' })
    }

    // CORRECTION DU CHEMIN : db.json est dans le dossier 'server'
    const dbPath = path.resolve(process.cwd(), 'server', 'db.json')
    
    const rawData = await fs.readFile(dbPath, 'utf-8')
    const dbData = JSON.parse(rawData)

    // Trouver l'utilisateur par son ID (UUID)
    const userIndex = dbData.users.findIndex((u: any) => u.id === userId)

    if (userIndex === -1) {
      throw createError({ statusCode: 404, statusMessage: 'Utilisateur non trouvé dans la DB' })
    }

    // Mise à jour sélective avec les noms exacts de votre db.json
    const updatedUser = {
      ...dbData.users[userIndex],
      username: body.username ?? dbData.users[userIndex].username,
      firstName: body.firstName ?? dbData.users[userIndex].firstName,
      lastName: body.lastName ?? dbData.users[userIndex].lastName,
      avatar: body.avatar ?? dbData.users[userIndex].avatar,
      // On utilise householdSize comme dans votre JSON
      householdSize: body.householdSize ?? dbData.users[userIndex].householdSize 
    }

    // Sauvegarde
    dbData.users[userIndex] = updatedUser
    await fs.writeFile(dbPath, JSON.stringify(dbData, null, 2))

    return { 
      success: true, 
      user: updatedUser 
    }

  } catch (error: any) {
    // Ce log apparaîtra dans votre terminal de commande (VS Code)
    console.error('[Erreur Serveur]:', error.message)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la mise à jour'
    })
  }
})