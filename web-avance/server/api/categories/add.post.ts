import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Create a new category linked to the authenticated user context
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId = event.context.auth.userId;
  const dbPath = path.resolve('server/db.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  const newCategory = {
    id: crypto.randomUUID(),
    nom: body.nom,
    userId: userId,
    tasks: []
  };

  db.categories.push(newCategory);
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

  return { success: true, category: newCategory };
});