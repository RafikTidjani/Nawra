// src/lib/resend.ts
import { Resend } from 'resend';
import type { Order } from '@/types';

const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.RESEND_FROM_EMAIL || 'nawra@nawra.fr';
const ADMIN = process.env.RESEND_ADMIN_EMAIL || FROM;

// Email client — confirmation de commande
export async function sendOrderConfirmation(order: Order) {
  if (!resend) {
    console.warn('[resend] API key not configured, skipping email');
    return;
  }

  const total = order.total;
  const products = order.products.length;

  await resend.emails.send({
    from: FROM,
    to: order.customer.email,
    subject: `✨ Votre commande Nawra est confirmée — #${order.id?.slice(0,8)}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#1A0A00;">
        <div style="background:#0D0608;padding:32px;text-align:center;">
          <h1 style="font-size:32px;color:#F5C842;margin:0;letter-spacing:-0.01em;">نـوّرة</h1>
          <p style="color:rgba(250,243,232,0.4);font-size:9px;letter-spacing:0.4em;text-transform:uppercase;margin:4px 0 0;">NAWRA</p>
        </div>
        <div style="padding:32px;background:#FAF3E8;">
          <h2 style="font-size:24px;color:#1A0A00;margin:0 0 8px;">Commande confirmée !</h2>
          <p style="color:#6b5a3e;font-size:14px;line-height:1.8;margin:0 0 24px;">
            Bonjour ${order.customer.name},<br/>
            Votre corbeille <strong>${order.theme}</strong> est bien reçue.
            Nous la préparons avec soin.
          </p>
          <div style="background:#fff;border:1px solid rgba(0,0,0,0.07);border-radius:4px;padding:20px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#aaa;font-size:13px;">Thème</span>
              <strong style="font-size:13px;">${order.theme}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#aaa;font-size:13px;">Taille</span>
              <strong style="font-size:13px;">${order.size}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#aaa;font-size:13px;">Articles</span>
              <strong style="font-size:13px;">${products}</strong>
            </div>
            <div style="height:1px;background:rgba(0,0,0,0.06);margin:12px 0;"/>
            <div style="display:flex;justify-content:space-between;">
              <span style="font-size:15px;font-weight:600;">Total</span>
              <strong style="font-size:20px;color:#C9921A;">${total}€</strong>
            </div>
          </div>
          <p style="color:#6b5a3e;font-size:13px;line-height:1.8;">
            Livraison prévue sous <strong>2 à 3 jours ouvrés</strong> à :<br/>
            ${order.customer.address}, ${order.customer.zip} ${order.customer.city}
          </p>
        </div>
        <div style="background:#1A0A00;padding:20px;text-align:center;">
          <p style="color:rgba(250,243,232,0.3);font-size:11px;margin:0;">
            Questions ? Répondez à cet email ou contactez-nous.<br/>
            <span style="color:#C9921A;">nawra.fr</span>
          </p>
        </div>
      </div>
    `,
  });
}

// Email admin — nouvelle commande
export async function sendAdminNotification(order: Order) {
  if (!resend) {
    console.warn('[resend] API key not configured, skipping email');
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: ADMIN,
    subject: `🛍️ Nouvelle commande ${order.total}€ — ${order.customer.name}`,
    html: `
      <div style="font-family:monospace;max-width:500px;margin:0 auto;">
        <h2>Nouvelle commande Nawra</h2>
        <pre style="background:#f5f5f5;padding:16px;border-radius:4px;font-size:13px;">
Ref     : ${order.id?.slice(0,8)}
Client  : ${order.customer.name}
Email   : ${order.customer.email}
Tél     : ${order.customer.phone}
Adresse : ${order.customer.address}, ${order.customer.zip} ${order.customer.city}
---
Thème   : ${order.theme}
Taille  : ${order.size}
Articles: ${order.products.length}
Total   : ${order.total}€
---
${order.customer.message ? `Message : ${order.customer.message}` : ''}
${order.deliveryDate ? `Livraison souhaitée : ${order.deliveryDate}` : ''}
        </pre>
      </div>
    `,
  });
}
