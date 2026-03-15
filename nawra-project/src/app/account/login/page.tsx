// src/app/account/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/customer-auth';
import Navbar from '@/components/sections/Navbar';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/account');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-20">
        <div className="max-w-md mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-semibold text-primary mb-2">
              Connexion
            </h1>
            <p className="font-body text-primary/60">
              Accédez à votre espace client VELORA
            </p>
          </div>

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

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <Link
              href="/account/forgot-password"
              className="text-sm text-primary/60 hover:text-secondary transition-colors"
            >
              Mot de passe oublié ?
            </Link>

            <p className="text-sm text-primary/60">
              Pas encore de compte ?{' '}
              <Link href="/account/register" className="text-secondary font-semibold hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>

          <div className="mt-10 pt-8 border-t border-primary/10 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-primary/60 hover:text-primary transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour à la boutique
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
