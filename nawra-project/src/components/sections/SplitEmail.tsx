// src/components/sections/SplitEmail.tsx
'use client';

import { useState, FormEvent } from 'react';
import { ARABESQUE_BG } from '@/lib/data';

export default function SplitEmail() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStatus('success');
    setEmail('');
    setTimeout(() => setStatus('idle'), 4000);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left - Dark */}
        <div
          className="relative py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-dark flex items-center justify-center"
          style={{ backgroundImage: ARABESQUE_BG }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-dark via-dark/95 to-dark" />

          <div className="relative z-10 max-w-md w-full">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Newsletter
            </span>

            <h2 className="font-amiri text-cream text-3xl md:text-4xl lg:text-5xl mb-4 leading-tight">
              Restez au courant de nos
              <span className="text-gradient block mt-1">nouvelles créations</span>
            </h2>

            <p className="font-cormorant text-cream/50 text-base md:text-lg leading-relaxed mb-8">
              Inscrivez-vous pour recevoir nos inspirations, nouveautés et offres exclusives.
            </p>

            <div className="flex flex-wrap gap-4 text-cream/40 text-sm">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Pas de spam
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Désabonnement facile
              </span>
            </div>
          </div>
        </div>

        {/* Right - Form */}
        <div className="py-16 md:py-24 px-6 md:px-12 lg:px-16 bg-cream flex items-center justify-center">
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email field */}
              <div>
                <label htmlFor="email-newsletter" className="block text-dark/70 text-sm font-medium mb-2">
                  Votre adresse email
                </label>
                <input
                  id="email-newsletter"
                  type="email"
                  placeholder="marie@exemple.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-4 rounded-xl border-2 border-dark/10 bg-white text-dark text-base focus:border-gold focus:outline-none focus:ring-4 focus:ring-gold/10 transition-all"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full btn-primary !py-4 !rounded-xl"
              >
                {status === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Inscription...
                  </span>
                ) : (
                  "S'inscrire à la newsletter"
                )}
              </button>

              {/* Status messages */}
              {status === 'success' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 animate-fade-up">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-emerald-800 font-medium">Bienvenue !</p>
                    <p className="text-emerald-600 text-sm">Vous êtes maintenant inscrit(e).</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 animate-fade-up">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-red-600 text-sm">Une erreur est survenue. Réessayez.</p>
                </div>
              )}
            </form>

            {/* Subscriber count */}
            <div className="mt-8 pt-6 border-t border-dark/10">
              <div className="flex items-center justify-center gap-3">
                <div className="flex -space-x-2">
                  {['bg-rose-300', 'bg-amber-300', 'bg-emerald-300'].map((color, i) => (
                    <div key={i} className={`w-8 h-8 rounded-full ${color} border-2 border-cream`} />
                  ))}
                </div>
                <p className="text-dark/50 text-sm">
                  Rejoignez <span className="text-dark font-semibold">+1,500</span> abonnées
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
