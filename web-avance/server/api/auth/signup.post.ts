import fs from 'node:fs/promises';
import path from 'node:path';
import bcrypt from 'bcryptjs';

/**
 * Handles new user registration
 * Persists user profile including household data and hashed credentials
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const dbPath = path.resolve('server/db.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  if (db.users.find((u: any) => u.username === body.username)) {
    throw createError({ statusCode: 400, statusMessage: 'Utilisateur déjà existant' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(body.password, salt);

  const newUser = {
    id: crypto.randomUUID(),
    username: body.username,
    password: hashedPassword,
    firstName: body.firstName,
    lastName: body.lastName,
    householdSize: body.householdSize,
    avatar: body.avatar,
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    refreshTokens: []
  };

  db.users.push(newUser);
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

  return { success: true };
});