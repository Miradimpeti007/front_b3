import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Updates all fields of an existing invoice
 * Security: Ownership check and 'isPaid' guard to prevent retro-active changes
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event); // Attend { id, prestataire, categorie, montant, dateEmission, dateEcheance }
  const userId = event.context.auth.userId;
  const dbPath = path.resolve('server/db.json');
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  const invoice = db.charges.find((i: any) => i.id === body.id && i.userId === userId);

  if (!invoice) {
    throw createError({ statusCode: 404, statusMessage: 'Invoice not found' });
  }

  if (invoice.isPaid) {
    throw createError({ 
      statusCode: 400, 
      statusMessage: 'Logic Error: Cannot edit a paid invoice' 
    });
  }

  /**
   * Mass assignment of updated fields
   */
  invoice.prestataire = body.prestataire;
  invoice.categorie = body.categorie;
  invoice.montant = parseFloat(body.montant);
  invoice.dateEmission = body.dateEmission;
  invoice.dateEcheance = body.dateEcheance;

  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));

  return { success: true, invoice };
});