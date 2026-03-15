// src/app/account/forgot-password/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { resetPassword } from '@/lib/customer-auth';
import Navbar from '@/components/sections/Navbar';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await resetPassword(email);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-20">
        <div className="max-w-md mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-semibold text-primary mb-2">
              Mot de passe oublié
            </h1>
            <p className="font-body text-primary/60">
              Entrez votre email pour réinitialiser votre mot de passe
            </p>
          </div>

          {status === 'sent' ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-heading text-xl font-semibold text-primary mb-2">
                Email envoyé !
              </h3>
              <p className="font-body text-primary/60 mb-6">
                Vérifiez votre boîte mail et suivez les instructions pour réinitialiser votre mot de passe.
              </p>
              <Link
                href="/account/login"
                className="inline-flex px-6 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90"
              >
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                  placeholder="vous@exemple.fr"
                />
              </div>

              {status === 'error' && (
                <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  Une erreur est survenue. Vérifiez votre email et réessayez.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {status === 'sending' ? 'Envoi...' : 'Réinitialiser le mot de passe'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/account/login"
              className="inline-flex items-center gap-2 text-sm text-primary/60 hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour à la connexion
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
