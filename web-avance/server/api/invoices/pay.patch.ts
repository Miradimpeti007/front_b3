import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Handles invoice payment and user progression logic
 * Fixed: Uses a single variable for XP gain to ensure data consistency
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId = event.context.auth.userId;
  const dbPath = path.resolve('server/db.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  const invoice = db.charges.find((i: any) => i.id === body.id && i.userId === userId);

  if (!invoice) {
    throw createError({ statusCode: 404, statusMessage: 'Invoice not found' });
  }

  if (invoice.isPaid) {
    return { success: false, message: 'Already paid' };
  }

  invoice.isPaid = true;

  const user = db.users.find((u: any) => u.id === userId);
  if (user) {
    // Calcul unique du gain
    const baseBonus = 50;
    const amountBonus = Math.floor(invoice.montant / 10);
    const totalGain = baseBonus + amountBonus;

    // Application à la base de données
    user.xp += totalGain;

    if (user.xp >= user.nextLevelXp) {
      user.level++;
      user.xp = 0;
      user.nextLevelXp = Math.round(user.level * 100 * 1.2);
    }

    /**
     * Data Persistence
     */
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

    // Renvoi de la réponse en utilisant la MEME variable
    return { 
      success: true, 
      progression: {
        level: user.level,
        xp: user.xp,
        nextLevelXp: user.nextLevelXp,
        gain: totalGain // Utilisation directe de la variable calculée
      }
    };
  }

  return { success: false };
});