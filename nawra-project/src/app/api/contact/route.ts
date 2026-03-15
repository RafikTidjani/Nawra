// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { resend } from '@/lib/resend';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'contact@velorabeauty.fr';
const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@velorabeauty.fr';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, orderNumber, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    const subjectLabels: Record<string, string> = {
      question: 'Question générale',
      order: 'Suivi de commande',
      return: 'Retour / Échange',
      product: 'Question produit',
      other: 'Autre',
    };

    // Send email to admin
    if (resend) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        replyTo: email,
        subject: `[Contact VELORA] ${subjectLabels[subject] || subject} - ${name}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#1A1A1A;margin-bottom:24px;">Nouveau message de contact</h2>

            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:8px 0;color:#666;width:140px;">Nom</td>
                <td style="padding:8px 0;color:#1A1A1A;font-weight:500;">${name}</td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#666;">Email</td>
                <td style="padding:8px 0;color:#1A1A1A;">
                  <a href="mailto:${email}" style="color:#C9A84C;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:8px 0;color:#666;">Sujet</td>
                <td style="padding:8px 0;color:#1A1A1A;">${subjectLabels[subject] || subject}</td>
              </tr>
              ${orderNumber ? `
              <tr>
                <td style="padding:8px 0;color:#666;">N° Commande</td>
                <td style="padding:8px 0;color:#1A1A1A;font-family:monospace;">${orderNumber}</td>
              </tr>
              ` : ''}
            </table>

            <div style="margin-top:24px;padding:20px;background:#f9f9f9;border-radius:8px;">
              <p style="margin:0;color:#666;font-size:13px;margin-bottom:8px;">Message :</p>
              <p style="margin:0;color:#1A1A1A;white-space:pre-wrap;">${message}</p>
            </div>

            <p style="margin-top:24px;color:#999;font-size:12px;">
              Répondez directement à cet email pour contacter ${name}.
            </p>
          </div>
        `,
      });
    } else {
      // Log to console if Resend not configured
      console.log('[Contact Form]', { name, email, subject, orderNumber, message });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Contact API Error]', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
