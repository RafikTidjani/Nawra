// src/lib/admin.ts
import { headers } from 'next/headers';

export async function isAdminRequest(): Promise<boolean> {
  const headersList = await headers();
  const secret = headersList.get('x-admin-secret');
  const adminSecret = process.env.ADMIN_SECRET;

  if (!adminSecret) {
    console.warn('ADMIN_SECRET not configured');
    return false;
  }

  return secret === adminSecret;
}
