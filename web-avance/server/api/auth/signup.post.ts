import fs from 'node:fs/promises'
import path from 'node:path'
import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) // Attend : { username, password, householdSize, avatar }
  const dbPath = path.resolve('server/db.json')
  
  // 1. Lecture de la base de données
  const data = await fs.readFile(dbPath, 'utf-8')
  const db = JSON.parse(data)

  // 2. Vérification si le pseudo existe déjà
  const exists = db.users.find((u: any) => u.username === body.username)
  if (exists) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ce pseudo est déjà utilisé.'
    })
  }

  // 3. Hachage du mot de passe (Méthode Pro)
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(body.password, salt)

  // 4. Création de l'objet utilisateur complet
  const newUser = {
    id: crypto.randomUUID(), // Identifiant unique sécurisé
    username: body.username,
    password: hashedPassword, // On stocke le hash, pas le mot de passe en clair
    householdSize: body.householdSize,
    avatar: body.avatar,
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    refreshTokens: [] // Liste vide pour accueillir les futures sessions
  }

  // 5. Sauvegarde
  db.users.push(newUser)
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2))

  return { success: true, message: 'Compte créé avec succès !' }
})