// src/app/mentions-legales/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mentions Légales | VELORA',
  description: 'Mentions légales du site VELORA - Coiffeuses premium',
};

export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-primary/60 hover:text-primary mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à l'accueil
        </Link>

        <h1 className="font-heading text-4xl font-semibold text-primary mb-8">
          Mentions Légales
        </h1>

        <div className="prose prose-lg max-w-none font-body text-primary/80">
          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              1. Éditeur du site
            </h2>
            <p>
              Le site VELORA (velorabeauty.fr) est édité par :<br />
              <strong>VELORA</strong><br />
              Micro-entreprise<br />
              France<br />
              Email : contact@velorabeauty.fr
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              2. Hébergement
            </h2>
            <p>
              Le site est hébergé par :<br />
              <strong>Railway Corp</strong><br />
              548 Market St, San Francisco, CA 94104, USA<br />
              Site web : railway.app
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              3. Propriété intellectuelle
            </h2>
            <p>
              L'ensemble des éléments constituant le site VELORA (textes, graphismes,
              logiciels, photographies, images, vidéos, sons, plans, logos, marques,
              créations et œuvres protégeables diverses, bases de données, etc.)
              ainsi que le site lui-même, sont la propriété exclusive de VELORA.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication,
              transmission, ou plus généralement toute exploitation non autorisée
              du site et de son contenu, sans accord préalable et écrit de VELORA,
              est strictement interdite.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              4. Données personnelles
            </h2>
            <p>
              Les informations recueillies sur ce site sont enregistrées dans un
              fichier informatisé par VELORA pour la gestion des commandes et la
              relation client.
            </p>
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD),
              vous disposez d'un droit d'accès, de rectification, de suppression et
              d'opposition aux données vous concernant.
            </p>
            <p>
              Pour exercer ces droits, contactez-nous à : contact@velorabeauty.fr
            </p>
            <p>
              Pour plus d'informations, consultez notre{' '}
              <Link href="/confidentialite" className="text-secondary hover:underline">
                Politique de Confidentialité
              </Link>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              5. Cookies
            </h2>
            <p>
              Le site VELORA utilise des cookies pour améliorer l'expérience
              utilisateur et analyser le trafic. En continuant à naviguer sur ce
              site, vous acceptez l'utilisation de cookies conformément à notre
              politique de confidentialité.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              6. Droit applicable
            </h2>
            <p>
              Les présentes mentions légales sont soumises au droit français.
              En cas de litige, les tribunaux français seront seuls compétents.
            </p>
          </section>

          <p className="text-sm text-primary/50 mt-12">
            Dernière mise à jour : Mars 2026
          </p>
        </div>
      </div>
    </main>
  );
}
