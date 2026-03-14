// src/lib/admin-auth.ts
// Helper pour vérifier l'authentification admin

import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'velora-admin-secret-key-change-in-production'
);

export interface AdminPayload {
  adminId: string;
  email: string;
  name: string;
}

export async function verifyAdmin(req: NextRequest): Promise<AdminPayload | null> {
  try {
    const token = req.cookies.get('velora-admin-token')?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    return {
      adminId: payload.adminId as string,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}
