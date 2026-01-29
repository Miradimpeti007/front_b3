import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Fetch categories restricted to the authenticated user session
 * Access control is guaranteed by the global auth middleware
 */
export default defineEventHandler(async (event) => {
  const userId = event.context.auth.userId;
  const dbPath = path.resolve('server/db.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  /**
   * Filter logic executed on server-side to prevent data leakage
   */
  const userCategories = db.categories.filter((c: any) => c.userId === userId);

  return userCategories;
});