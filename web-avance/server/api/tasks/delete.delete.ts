import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Removes a task from a user-owned category
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event); // { catId, taskId }
  const userId = event.context.auth.userId;
  const dbPath = path.resolve('server/db.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  const category = db.categories.find((c: any) => c.id === body.catId && c.userId === userId);

  if (!category) {
    throw createError({ statusCode: 403, statusMessage: 'Access denied' });
  }

  category.tasks = category.tasks.filter((t: any) => t.id !== body.taskId);
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

  return { success: true };
});