import fs from 'node:fs/promises'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) // { catId, taskId }
  const dbPath = path.resolve('server/db.json')
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'))

  const cat = db.categories.find((c: any) => c.id === body.catId)
  if (cat) {
    cat.tasks = cat.tasks.filter((t: any) => t.id !== body.taskId)
  }

  await fs.writeFile(dbPath, JSON.stringify(db, null, 2))
  return { success: true }
})