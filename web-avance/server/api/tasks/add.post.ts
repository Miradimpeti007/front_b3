import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Adds a new task to a specific category
 * Verification: Checks category ownership before insertion
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event); // { categoryId, title, description }
  const userId = event.context.auth.userId;
  const dbPath = path.resolve('server/db.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  const category = db.categories.find((c: any) => c.id === body.categoryId && c.userId === userId);

  if (!category) {
    throw createError({ statusCode: 404, statusMessage: 'Category not found or access denied' });
  }

  const newTask = {
    id: crypto.randomUUID(),
    title: body.title,
    description: body.description,
    completed: false,
    createdAt: new Date().toISOString()
  };

  category.tasks.push(newTask);
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

  return { success: true, task: newTask };
});