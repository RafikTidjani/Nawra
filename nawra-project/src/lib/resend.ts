// src/lib/resend.ts
import { Resend } from 'resend';
import type { Order } from '@/types';

const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.EMAIL_FROM || 'noreply@planaura.fr';
const ADMIN = process.env.ADMIN_EMAIL || FROM;

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
    subject: `Ta commande VELORA est confirmée ✨ (#${order.id?.slice(0,8)})`,
    html: `
      <div style="font-family:'DM Sans',system-ui,sans-serif;max-width:560px;margin:0 auto;color:#1A1A1A;">
        <div style="background:#1A1A1A;padding:32px;text-align:center;">
          <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;color:#FAFAF8;margin:0;letter-spacing:0.25em;font-weight:600;">VELORA</h1>
          <p style="color:rgba(250,250,248,0.5);font-size:11px;letter-spacing:0.15em;margin:8px 0 0;">COIFFEUSES PREMIUM</p>
        </div>
        <div style="padding:32px;background:#FAFAF8;">
          <h2 style="font-size:24px;color:#1A1A1A;margin:0 0 8px;">Ta commande est confirmée !</h2>
          <p style="color:#6B6B6B;font-size:14px;line-height:1.8;margin:0 0 24px;">
            Bonjour ${order.customer.name},<br/>
            Nous avons bien reçu ta commande. Elle est en cours de préparation.
          </p>
          <div style="background:#fff;border:1px solid rgba(0,0,0,0.07);border-radius:12px;padding:20px;margin-bottom:20px;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#6B6B6B;font-size:13px;">Référence</span>
              <strong style="font-size:13px;">#${order.id?.slice(0,8)}</strong>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:#6B6B6B;font-size:13px;">Articles</span>
              <strong style="font-size:13px;">${products}</strong>
            </div>
            <div style="height:1px;background:rgba(0,0,0,0.06);margin:12px 0;"/>
            <div style="display:flex;justify-content:space-between;">
              <span style="font-size:15px;font-weight:600;">Total</span>
              <strong style="font-size:20px;color:#C9A84C;">${total}€</strong>
            </div>
          </div>
          <p style="color:#6B6B6B;font-size:13px;line-height:1.8;">
            <strong>Livraison offerte</strong> sous <strong>5 à 7 jours ouvrés</strong> à :<br/>
            ${order.customer.address}, ${order.customer.zip} ${order.customer.city}
          </p>
          <p style="color:#6B6B6B;font-size:13px;line-height:1.8;margin-top:16px;">
            Tu recevras un email avec le numéro de suivi dès que ta commande sera expédiée.
          </p>
        </div>
        <div style="background:#1A1A1A;padding:20px;text-align:center;">
          <p style="color:rgba(250,250,248,0.4);font-size:11px;margin:0;">
            Des questions ? Réponds à cet email ou contacte-nous.<br/>
            <span style="color:#C9A84C;">velorabeauty.fr</span>
          </p>
        </div>
      </div>
    `,
  });
}

// Email expédition
export async function sendShippingNotification(order: Order, trackingNumber: string, carrierUrl: string) {
  if (!resend) {
    console.warn('[resend] API key not configured, skipping email');
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: order.customer.email,
    subject: `Ton colis VELORA est en route 🚚 (#${order.id?.slice(0,8)})`,
    html: `
      <div style="font-family:'DM Sans',system-ui,sans-serif;max-width:560px;margin:0 auto;color:#1A1A1A;">
        <div style="background:#1A1A1A;padding:32px;text-align:center;">
          <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;color:#FAFAF8;margin:0;letter-spacing:0.25em;font-weight:600;">VELORA</h1>
          <p style="color:rgba(250,250,248,0.5);font-size:11px;letter-spacing:0.15em;margin:8px 0 0;">COIFFEUSES PREMIUM</p>
        </div>
        <div style="padding:32px;background:#FAFAF8;">
          <h2 style="font-size:24px;color:#1A1A1A;margin:0 0 8px;">Ta commande est en route !</h2>
          <p style="color:#6B6B6B;font-size:14px;line-height:1.8;margin:0 0 24px;">
            Bonjour ${order.customer.name},<br/>
            Ton colis a été expédié et sera livré sous 3 à 5 jours ouvrés.
          </p>
          <div style="background:#fff;border:1px solid rgba(0,0,0,0.07);border-radius:12px;padding:20px;margin-bottom:20px;">
            <div style="margin-bottom:12px;">
              <span style="color:#6B6B6B;font-size:13px;display:block;margin-bottom:4px;">Numéro de suivi</span>
              <strong style="font-size:16px;">${trackingNumber}</strong>
            </div>
            <a href="${carrierUrl}" style="display:inline-block;background:#1A1A1A;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500;">
              Suivre mon colis
            </a>
          </div>
          <p style="color:#6B6B6B;font-size:13px;line-height:1.8;">
            Adresse de livraison :<br/>
            ${order.customer.address}, ${order.customer.zip} ${order.customer.city}
          </p>
        </div>
        <div style="background:#1A1A1A;padding:20px;text-align:center;">
          <p style="color:rgba(250,250,248,0.4);font-size:11px;margin:0;">
            L'équipe VELORA — <span style="color:#C9A84C;">contact@velorabeauty.fr</span>
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
    subject: `🛍️ Nouvelle commande VELORA ${order.total}€ — ${order.customer.name}`,
    html: `
      <div style="font-family:monospace;max-width:500px;margin:0 auto;">
        <h2>Nouvelle commande VELORA</h2>
        <pre style="background:#f5f5f5;padding:16px;border-radius:4px;font-size:13px;">
Ref     : ${order.id?.slice(0,8)}
Client  : ${order.customer.name}
Email   : ${order.customer.email}
Tél     : ${order.customer.phone}
Adresse : ${order.customer.address}, ${order.customer.zip} ${order.customer.city}
---
Articles: ${order.products.length}
Total   : ${order.total}€
---
${order.customer.message ? `Message : ${order.customer.message}` : ''}
        </pre>
      </div>
    `,
  });
}
