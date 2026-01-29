import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Fetch all household charges associated with the authenticated user
 * Security: Filters data based on the userId provided by the auth middleware
 */
export default defineEventHandler(async (event) => {
  const userAuth = event.context.auth;
  const dbPath = path.resolve('server/db.json');

  /**
   * Data Persistence Layer access
   */
  const db = JSON.parse(await fs.readFile(dbPath, 'utf-8'));

  /**
   * Returns only the charges where ownership matches the current session
   * Note: Status (Overdue/Warning) is calculated on the frontend to save resources
   */
  const userInvoices = db.charges.filter((invoice: any) => invoice.userId === userAuth.userId);

  return userInvoices;
});