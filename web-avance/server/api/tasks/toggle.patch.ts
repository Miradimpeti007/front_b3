import fs from 'node:fs/promises';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userId = event.context.auth.userId;
  const dbPath = path.resolve('server/db.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  const category = db.categories.find((c: any) => c.id === body.catId && c.userId === userId);
  if (!category) throw createError({ statusCode: 403, statusMessage: 'Access denied' });

  const task = category.tasks.find((t: any) => t.id === body.taskId);
  if (!task) throw createError({ statusCode: 404, statusMessage: 'Task not found' });

  // --- LA CORRECTION : SÉCURITÉ DE VALIDATION ---
  // Si la tâche est déjà terminée, on ne fait rien et on renvoie l'état actuel
  if (task.isDone) {
    return { 
      success: true, 
      isDone: true, 
      message: 'Task already validated' 
    };
  }

  // On force le passage à true au lieu de toggler
  task.isDone = true;

  // Logique de progression (XP Gain)
  // Maintenant, ce bloc ne s'exécutera qu'UNE SEULE FOIS par tâche
  const user = db.users.find((u: any) => u.id === userId);
  if (user) {
    const XP_GAIN = 10;
    user.xp += XP_GAIN;

    // Algorithme de montée de niveau
    if (user.xp >= user.nextLevelXp) {
      user.level++;
      user.xp = 0;
      // Difficulté exponentielle : $$nextLevelXp = level \times 100 \times 1.2$$
      user.nextLevelXp = Math.round(user.level * 100 * 1.2);
    }
  }

  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

  const updatedUser = db.users.find((u: any) => u.id === userId);
  return { 
    success: true, 
    isDone: true,
    progression: {
      level: updatedUser.level,
      xp: updatedUser.xp,
      nextLevelXp: updatedUser.nextLevelXp
    }
  };
});