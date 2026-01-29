import fs from 'node:fs/promises';
import path from 'node:path';
import jwt from 'jsonwebtoken';

/**
 * Validates current session token and retrieves full user profile
 * Essential for state persistence upon application initialization (F5)
 */
export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token');
  const config = useRuntimeConfig(event);

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Session absente' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtAccessSecret) as { userId: string };
    const dbPath = path.resolve('server/db.json');
    const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
    
    const user = db.users.find((u: any) => u.id === decoded.userId);

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Utilisateur inexistant' });
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        householdSize: user.householdSize,
        level: user.level,
        xp: user.xp,
        nextLevelXp: user.nextLevelXp
      }
    };
  } catch (err) {
    throw createError({ statusCode: 401, statusMessage: 'Session expirée' });
  }
});