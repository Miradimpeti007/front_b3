import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Invalidates user session by removing the refresh token from persistence
 * and clearing client-side cookies
 */
export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refresh_token');
  const dbPath = path.resolve('server/db.json');

  if (refreshToken) {
    const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
    const user = db.users.find((u: any) => u.refreshTokens.includes(refreshToken));
    if (user) {
      user.refreshTokens = user.refreshTokens.filter((t: string) => t !== refreshToken);
      await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
    }
  }

  deleteCookie(event, 'auth_token', { path: '/' });
  deleteCookie(event, 'refresh_token', { path: '/' });

  return { success: true };
});