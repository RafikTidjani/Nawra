// src/app/cgv/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente | VELORA',
  description: 'CGV du site VELORA - Coiffeuses premium',
};

export default function CGV() {
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
          Conditions Générales de Vente
        </h1>

        <div className="prose prose-lg max-w-none font-body text-primary/80">
          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              Article 1 – Objet
            </h2>
            <p>
              Les présentes conditions générales de vente (CGV) régissent les ventes
              de produits effectuées sur le site VELORA (velorabeauty.fr) et définissent
              les droits et obligations des parties dans le cadre de la vente en ligne
              de coiffeuses et accessoires.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              Article 2 – Prix
            </h2>
            <p>
              Les prix de nos produits sont indiqués en euros toutes taxes comprises (TTC).
              VELORA se réserve le droit de modifier ses prix à tout moment, étant
              entendu que le prix figurant sur le site le jour de la commande sera
              le seul applicable à l'acheteur.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              Article 3 – Commande
            </h2>
            <p>
              L'acheteur passe commande sur le site internet VELORA. Pour acheter un
              produit, l'acheteur doit obligatoirement suivre le processus de commande :
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Choix du ou des produits et ajout au panier</li>
              <li>Validation du panier</li>
              <li>Renseignement des informations de livraison</li>
              <li>Choix du mode de paiement et validation</li>
              <li>Paiement sécurisé</li>
              <li>Confirmation de commande par email</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              Article 4 – Paiement
            </h2>
            <p>
              Le paiement s'effectue en ligne par carte bancaire (Visa, Mastercard,
              American Express) via notre prestataire de paiement sécurisé Stripe.
            </p>
            <p className="mt-4">
              Le paiement en 3x sans frais est disponible à partir de 150€ d'achat
              via Klarna.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              Article 5 – Livraison
            </h2>
            <p>
              <strong>Zone de livraison :</strong> France métropolitaine uniquement.
            </p>
            <p className="mt-4">
              <strong>Frais de livraison :</strong> La livraison est offerte pour
              toutes les commandes.
            </p>
            <p className="mt-4">
              <strong>Délai de livraison :</strong> 5 à 7 jours ouvrés à compter de
              la confirmation de commande. Un email avec le numéro de suivi sera
              envoyé dès l'expédition.
            </p>
            <p className="mt-4">
              En cas de retard de livraison, merci de nous contacter à
              contact@velorabeauty.fr
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              Article 6 – Droit de rétractation
            </h2>
            <p>
              Conformément à l'article L.221-18 du Code de la consommation, vous
              disposez d'un délai de <strong>14 jours</strong> à compter de la
              réception de votre commande pour exercer votre droit de rétractation
              sans avoir à justifier de motifs ni à payer de pénalités.
            </p>
            <p className="mt-4">
              VELORA étend ce délai à <strong>30 jours</strong> pour vous offrir
              plus de tranquillité.
            </p>
            <p className="mt-4">
              Pour exercer ce droit, contactez-nous par email à contact@velorabeauty.fr
              en indiquant votre numéro de commande. Les frais de retour sont à la
              charge de VELORA.
            </p>
            <p className="mt-4">
              Le produit doit être retourné dans son emballage d'origine, non utilisé
              et en parfait état.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              Article 7 – Garantie
            </h2>
            <p>
              Tous nos produits bénéficient de la garantie légale de conformité
              (articles L.217-4 et suivants du Code de la consommation) et de la
              garantie des vices cachés (articles 1641 et suivants du Code civil).
            </p>
            <p className="mt-4">
              En plus des garanties légales, VELORA offre une <strong>garantie
              commerciale de 2 ans</strong> sur toutes les coiffeuses (hors LED,
              garanties 1 an).
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              Article 8 – Service client
            </h2>
            <p>
              Pour toute question ou réclamation, notre service client est disponible :
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Par email : contact@velorabeauty.fr</li>
              <li>Réponse sous 24-48h ouvrées</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              Article 9 – Médiation
            </h2>
            <p>
              En cas de litige, vous pouvez recourir gratuitement au service de
              médiation de la consommation. Le médiateur tentera, en toute
              indépendance et impartialité, de rapprocher les parties en vue
              d'aboutir à une solution amiable.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              Article 10 – Droit applicable
            </h2>
            <p>
              Les présentes CGV sont soumises au droit français. En cas de litige,
              les tribunaux français seront seuls compétents.
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
