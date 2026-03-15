// src/app/account/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/lib/customer-auth';
import Navbar from '@/components/sections/Navbar';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      await signUp(formData.email, formData.password, formData.firstName, formData.lastName);
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue';
      if (message.includes('already registered')) {
        setError('Cette adresse email est déjà utilisée');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-32 pb-20">
          <div className="max-w-md mx-auto px-6 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="font-heading text-3xl font-semibold text-primary mb-4">
              Compte créé !
            </h1>
            <p className="font-body text-primary/60 mb-8">
              Vérifiez votre boîte mail pour confirmer votre adresse email,
              puis connectez-vous à votre compte.
            </p>
            <Link
              href="/account/login"
              className="inline-flex px-8 py-4 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-20">
        <div className="max-w-md mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-semibold text-primary mb-2">
              Créer un compte
            </h1>
            <p className="font-body text-primary/60">
              Rejoignez VELORA pour suivre vos commandes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Prénom
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                  placeholder="Marie"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Nom
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                  placeholder="Dupont"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                placeholder="Minimum 6 caractères"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>

            <p className="text-xs text-center text-primary/50">
              En créant un compte, vous acceptez nos{' '}
              <Link href="/cgv" className="underline">CGV</Link> et notre{' '}
              <Link href="/confidentialite" className="underline">politique de confidentialité</Link>.
            </p>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-primary/60">
              Déjà un compte ?{' '}
              <Link href="/account/login" className="text-secondary font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
