import fs from 'node:fs/promises';
import path from 'node:path';
import jwt from 'jsonwebtoken';

/**
 * Executes JWT rotation (Rolling Refresh)
 * Revokes old refresh token and issues a new synchronized pair
 */
export default defineEventHandler(async (event) => {
  const oldRefreshToken = getCookie(event, 'refresh_token');
  const config = useRuntimeConfig(event);

  if (!oldRefreshToken) {
    throw createError({ statusCode: 401, statusMessage: 'Session expirée' });
  }

  const dbPath = path.resolve('server/db.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));
  const user = db.users.find((u: any) => u.refreshTokens.includes(oldRefreshToken));

  if (!user) {
    deleteCookie(event, 'auth_token', { path: '/' });
    deleteCookie(event, 'refresh_token', { path: '/' });
    throw createError({ statusCode: 403, statusMessage: 'Session révoquée' });
  }

  try {
    jwt.verify(oldRefreshToken, config.jwtRefreshSecret);

    const newAccessToken = jwt.sign(
      { userId: user.id }, 
      config.jwtAccessSecret, 
      { expiresIn: config.jwtAccessExpires as any }
    );
    
    const newRefreshToken = jwt.sign(
      { userId: user.id }, 
      config.jwtRefreshSecret, 
      { expiresIn: config.jwtRefreshExpires as any }
    );

    user.refreshTokens = user.refreshTokens.filter((t: string) => t !== oldRefreshToken);
    user.refreshTokens.push(newRefreshToken);
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    setCookie(event, 'auth_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: config.cookieAccessMaxAge,
      path: '/',
      sameSite: 'lax'
    });

    setCookie(event, 'refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: config.cookieRefreshMaxAge,
      path: '/',
      sameSite: 'lax'
    });

    return { success: true };
  } catch (err) {
    user.refreshTokens = user.refreshTokens.filter((t: string) => t !== oldRefreshToken);
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
    deleteCookie(event, 'auth_token', { path: '/' });
    deleteCookie(event, 'refresh_token', { path: '/' });
    throw createError({ statusCode: 401, statusMessage: 'Session expirée' });
  }
});