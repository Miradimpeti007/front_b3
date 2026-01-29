import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Creates a new household charge entry
 * Security: Assigns the userId from the authenticated context to prevent spoofing
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const userAuth = event.context.auth;
  const dbPath = path.resolve('server/db.json');

  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  /**
   * Data structure for a new invoice
   * isPaid is initialized to false by default
   */
  const newInvoice = {
    id: crypto.randomUUID(),
    userId: userAuth.userId,
    prestataire: body.prestataire,
    categorie: body.categorie,
    montant: parseFloat(body.montant),
    dateEmission: body.dateEmission,
    dateEcheance: body.dateEcheance,
    isPaid: false
  };

  /**
   * Persistence update
   */
  db.charges.push(newInvoice);
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

  return { success: true, invoice: newInvoice };
});