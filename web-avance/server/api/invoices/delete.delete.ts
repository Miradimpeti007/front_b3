import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Removes a household charge from the persistence layer
 * Security: Validates that the invoice belongs to the authenticated user before removal
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event); // Attend { id }
  const userId = event.context.auth.userId;
  const dbPath = path.resolve('server/db.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  /**
   * Ownership verification and filtering
   * Logic: Keeps all invoices EXCEPT the one that matches BOTH the ID and the Owner
   */
  const originalLength = db.charges.length;
  db.charges = db.charges.filter((invoice: any) => 
    !(invoice.id === body.id && invoice.userId === userId)
  );

  /**
   * Response handling: If length is identical, no deletion occurred (wrong ID or unauthorized)
   */
  if (db.charges.length === originalLength) {
    throw createError({ 
      statusCode: 403, 
      statusMessage: 'Forbidden: Invoice not found or access denied' 
    });
  }

  /**
   * Commit changes to the JSON storage
   */
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

  return { success: true };
});