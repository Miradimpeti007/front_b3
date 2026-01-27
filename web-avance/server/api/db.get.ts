import fs from 'node:fs/promises'
import path from 'node:path'

export default defineEventHandler(async () => {
  const dbPath = path.resolve('server/db.json')
  const data = await fs.readFile(dbPath, 'utf-8')
  return JSON.parse(data)
})