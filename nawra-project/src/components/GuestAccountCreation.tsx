// src/components/GuestAccountCreation.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/customer-auth';
import { useAuth } from '@/components/providers/AuthProvider';

interface GuestAccountCreationProps {
  email: string;
  firstName?: string;
  lastName?: string;
  orderId?: string;
}

export default function GuestAccountCreation({
  email,
  firstName = '',
  lastName = '',
}: GuestAccountCreationProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Don't show if user is already logged in
  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, firstName, lastName);
      setSuccess(true);
      // Redirect to account page after a delay
      setTimeout(() => {
        router.push('/account');
      }, 2000);
    } catch (err) {
      console.error(err);
      if ((err as Error).message?.includes('already registered')) {
        setError('Un compte existe déjà avec cet email. Connectez-vous pour voir votre commande.');
      } else {
        setError('Erreur lors de la création du compte. Veuillez réessayer.');
      }
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-heading text-lg text-emerald-800 mb-2">
          Compte créé avec succès !
        </h3>
        <p className="font-body text-emerald-600 text-sm">
          Redirection vers votre compte...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
          <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h3 className="font-heading text-lg text-primary">
            Créer un compte
          </h3>
          <p className="font-body text-text-secondary text-sm">
            Pour suivre votre commande et vos prochains achats
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-body text-text-secondary mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-2.5 rounded-lg border border-primary/10 bg-primary/5 text-primary/60"
          />
        </div>

        <div>
          <label className="block text-sm font-body text-text-secondary mb-1.5">
            Mot de passe *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Au moins 6 caractères"
            className="w-full px-4 py-2.5 rounded-lg border border-primary/10 focus:border-secondary outline-none"
            required
            minLength={6}
          />
        </div>

        <div>
          <label className="block text-sm font-body text-text-secondary mb-1.5">
            Confirmer le mot de passe *
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Répétez le mot de passe"
            className="w-full px-4 py-2.5 rounded-lg border border-primary/10 focus:border-secondary outline-none"
            required
            minLength={6}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-secondary text-primary font-body font-medium rounded-xl hover:bg-secondary/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Création...' : 'Créer mon compte'}
        </button>

        <p className="text-xs text-center text-text-secondary">
          En créant un compte, vous acceptez nos{' '}
          <a href="/legal/terms" className="text-secondary hover:underline">
            conditions générales
          </a>
        </p>
      </form>
    </div>
  );
}
