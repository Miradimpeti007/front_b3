import fs from 'node:fs/promises'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) // { id }
  const dbPath = path.resolve('server/db.json')
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'))

  db.categories = db.categories.filter((c: any) => c.id !== body.id)
  
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2))
  return { success: true }
})