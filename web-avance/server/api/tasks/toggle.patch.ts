import fs from 'node:fs/promises'
import path from 'node:path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) // { catId, taskId }
  const dbPath = path.resolve('server/db.json')
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'))

  const cat = db.categories.find((c: any) => c.id === body.catId)
  const task = cat?.tasks.find((t: any) => t.id === body.taskId)

  if (task) {
    task.isDone = !task.isDone
    
    // Gain d'XP uniquement si on coche (isDone passe à true)
    if (task.isDone) {
      const user = db.users.find((u: any) => u.id === cat.userId)
      if (user) {
        user.xp += 10
        // Formule de montée de niveau
        if (user.xp >= user.nextLevelXp) {
          user.level++
          user.xp = 0
          user.nextLevelXp = Math.round(user.level * 100 * 1.2)
        }
      }
    }
  }

  await fs.writeFile(dbPath, JSON.stringify(db, null, 2))
  return { success: true }
})