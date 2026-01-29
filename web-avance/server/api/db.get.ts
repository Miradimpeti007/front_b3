import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * DATABASE ACCESS CONTROL - SECURITY WARNING
 * This endpoint should never expose full database contents in production.
 * Access is restricted to authenticated users only.
 */
export default defineEventHandler(async (event) => {
  const userId = event.context.auth?.userId;

  if (!userId) {
    throw createError({ 
      statusCode: 401, 
      statusMessage: 'Unauthorized: Access to raw database is restricted' 
    });
  }

  const dbPath = path.resolve('server/db.json');
  const dbData = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  /**
   * Data Sanitization: Never return sensitive fields like 'password' or 'refreshTokens'
   */
  const sanitizedData = {
    categories: dbData.categories.filter((c: any) => c.userId === userId),
    user: dbData.users.find((u: any) => u.id === userId)
  };

  return sanitizedData;
});