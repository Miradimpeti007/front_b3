import fs from 'node:fs/promises'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) // { nom, userId }
  const dbPath = path.resolve('server/db.json')
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'))

  const newCat = {
    id: crypto.randomUUID(),
    userId: body.userId,
    nom: body.nom.toUpperCase(),
    tasks: []
  }

  db.categories.push(newCat)
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2))
  return newCat
})