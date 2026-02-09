import fs from 'node:fs/promises'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  try {
    const userId = event.context.auth?.userId

    if (!userId) {
      throw createError({ 
        statusCode: 401, 
        statusMessage: 'Action interdite : session invalide' 
      })
    }

    /**
     * Database path resolution
     * File is located in the /server directory
     */
    const dbPath = path.resolve(process.cwd(), 'server', 'db.json')
    const rawData = await fs.readFile(dbPath, 'utf-8')
    const dbData = JSON.parse(rawData)

    const initialUserCount = dbData.users.length

    /**
     * Cascade deletion logic
     * Removes the user and all associated relational data
     */
    dbData.users = dbData.users.filter((u: any) => u.id !== userId)
    
    // Nettoyage des données liées
    if (dbData.categories) {
      dbData.categories = dbData.categories.filter((c: any) => c.userId !== userId)
    }
    if (dbData.charges) {
      dbData.charges = dbData.charges.filter((ch: any) => ch.userId !== userId)
    }

    if (dbData.users.length === initialUserCount) {
      throw createError({ 
        statusCode: 404, 
        statusMessage: 'Utilisateur introuvable dans la base de données' 
      })
    }

    // Persistence of changes
    await fs.writeFile(dbPath, JSON.stringify(dbData, null, 2))

    /**
     * Session termination
     * Removal of authentication tokens from client cookies
     */
    deleteCookie(event, 'auth_token')
    deleteCookie(event, 'refresh_token')

    return { 
      success: true, 
      message: 'Compte et données associés supprimés avec succès' 
    }

  } catch (error: any) {
    console.error('[API Delete Error]:', error.message)
    
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Erreur lors de la suppression du compte'
    })
  }
})