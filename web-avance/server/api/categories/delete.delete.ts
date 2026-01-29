import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Removes a category from the database
 * Verification: Ensures the category belongs to the authenticated user
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId = event.context.auth.userId;
  const dbPath = path.resolve('server/db.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  /**
   * Data integrity: Filter keeps all categories except the one matching 
   * both the provided ID and the authenticated User ID
   */
  const originalLength = db.categories.length;
  db.categories = db.categories.filter((c: any) => !(c.id === body.id && c.userId === userId));

  if (db.categories.length === originalLength) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Ownership verification failed' });
  }

  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
  return { success: true };
});