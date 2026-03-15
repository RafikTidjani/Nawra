// src/app/contact/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'question',
    orderNumber: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('sent');
        setFormData({ name: '', email: '', subject: 'question', orderNumber: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-primary/60 hover:text-primary mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à l'accueil
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left - Contact Info */}
          <div>
            <h1 className="font-heading text-4xl font-semibold text-primary mb-4">
              Contactez-nous
            </h1>
            <p className="font-body text-primary/60 mb-8">
              Une question sur votre commande ? Besoin d'aide ? Notre équipe vous
              répond sous 24h.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-body font-semibold text-primary mb-1">Email</h3>
                  <a href="mailto:contact@velorabeauty.fr" className="text-primary/60 hover:text-secondary transition-colors">
                    contact@velorabeauty.fr
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-body font-semibold text-primary mb-1">Délai de réponse</h3>
                  <p className="text-primary/60">Sous 24h en jours ouvrés</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-body font-semibold text-primary mb-1">Instagram</h3>
                  <a
                    href="https://instagram.com/velorabeauty"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary/60 hover:text-secondary transition-colors"
                  >
                    @velorabeauty
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="mt-10 p-6 bg-accent rounded-2xl">
              <h3 className="font-heading text-lg font-semibold text-primary mb-2">
                Questions fréquentes
              </h3>
              <p className="font-body text-sm text-primary/60 mb-4">
                Consultez notre FAQ pour des réponses rapides sur la livraison,
                les retours et plus encore.
              </p>
              <Link
                href="/#faq"
                className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
              >
                Voir la FAQ
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div>
            {status === 'sent' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                  Message envoyé !
                </h3>
                <p className="font-body text-primary/60">
                  Nous vous répondrons sous 24h. Merci de nous avoir contactés.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                    placeholder="Marie Dupont"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                    placeholder="marie@exemple.fr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Sujet *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                  >
                    <option value="question">Question générale</option>
                    <option value="order">Suivi de commande</option>
                    <option value="return">Retour / Échange</option>
                    <option value="product">Question sur un produit</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                {formData.subject === 'order' || formData.subject === 'return' ? (
                  <div>
                    <label className="block text-sm font-medium text-primary mb-2">
                      Numéro de commande
                    </label>
                    <input
                      type="text"
                      value={formData.orderNumber}
                      onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                      placeholder="#abc123..."
                    />
                  </div>
                ) : null}

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all resize-none"
                    placeholder="Comment pouvons-nous vous aider ?"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-600 text-sm">
                    Une erreur est survenue. Veuillez réessayer ou nous contacter directement par email.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
