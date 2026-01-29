import fs from 'node:fs/promises';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Authenticates user and initializes secure HttpOnly sessions
 * Sets global path scope for cookies to ensure cross-route availability
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig(event);
  const dbPath = path.resolve('server/db.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  const user = db.users.find((u: any) => u.username === body.username);
  if (!user || !(await bcrypt.compare(body.password, user.password))) {
    throw createError({ statusCode: 401, statusMessage: 'Identifiants invalides' });
  }

  const accessToken = jwt.sign(
    { userId: user.id }, 
    config.jwtAccessSecret, 
    { expiresIn: config.jwtAccessExpires as any }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id }, 
    config.jwtRefreshSecret, 
    { expiresIn: config.jwtRefreshExpires as any }
  );

  user.refreshTokens.push(refreshToken);
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

  setCookie(event, 'auth_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: config.cookieAccessMaxAge,
    path: '/',
    sameSite: 'lax'
  });

  setCookie(event, 'refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: config.cookieRefreshMaxAge,
    path: '/',
    sameSite: 'lax'
  });

  return {
    user: {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      level: user.level,
      xp: user.xp,
      nextLevelXp: user.nextLevelXp
    }
  };
});