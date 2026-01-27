import fs from 'node:fs/promises'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) // { categoryId, title, description }
  const dbPath = path.resolve('server/db.json')
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'))

  const cat = db.categories.find((c: any) => c.id === body.categoryId)
  if (!cat) throw createError({ statusCode: 404, message: 'Catégorie non trouvée' })

  const newTask = {
    id: crypto.randomUUID(),
    title: body.title,
    description: body.description,
    isDone: false
  }

  cat.tasks.push(newTask)
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2))
  return newTask
})