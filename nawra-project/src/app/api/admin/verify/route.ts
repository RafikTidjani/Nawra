// src/app/api/admin/verify/route.ts
// Vérifie si l'admin est connecté (via cookie JWT)

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'velora-admin-secret-key-change-in-production'
);

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('velora-admin-token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, error: 'Non connecté' },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);

    return NextResponse.json({
      authenticated: true,
      admin: {
        id: payload.adminId,
        email: payload.email,
        name: payload.name,
      },
    });
  } catch {
    return NextResponse.json(
      { authenticated: false, error: 'Session expirée' },
      { status: 401 }
    );
  }
}

// Garde l'ancienne méthode POST pour compatibilité temporaire
export async function POST(req: NextRequest) {
  return GET(req);
}
