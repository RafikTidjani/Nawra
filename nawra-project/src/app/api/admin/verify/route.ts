// src/app/api/admin/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminSecret = process.env.ADMIN_SECRET;

    if (!adminSecret) {
      return NextResponse.json({ error: 'Admin non configuré' }, { status: 500 });
    }

    if (password === adminSecret) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
