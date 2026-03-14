// src/app/api/admin/login/route.ts
// Authentification admin via BDD

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'velora-admin-secret-key-change-in-production'
);

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Base de données non configurée' },
        { status: 500 }
      );
    }

    // Vérifier les credentials via la fonction SQL
    const { data, error } = await supabaseAdmin.rpc('verify_admin', {
      admin_email: email,
      admin_password: password,
    });

    if (error) {
      console.error('[admin/login] Error:', error);
      return NextResponse.json(
        { error: 'Erreur de connexion' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0 || !data[0].is_valid) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      );
    }

    const admin = data[0];

    // Mettre à jour last_login
    await supabaseAdmin
      .from('admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    // Créer le JWT
    const token = await new SignJWT({
      adminId: admin.id,
      email: admin.email,
      name: admin.name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    // Créer la réponse avec le cookie
    const response = NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });

    // Définir le cookie HTTPOnly
    response.cookies.set('velora-admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 heures
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[admin/login] Error:', err);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
