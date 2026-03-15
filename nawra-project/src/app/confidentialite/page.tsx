// src/app/confidentialite/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | VELORA',
  description: 'Politique de confidentialité et protection des données - VELORA',
};

export default function Confidentialite() {
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
          Politique de Confidentialité
        </h1>

        <div className="prose prose-lg max-w-none font-body text-primary/80">
          <p className="text-lg mb-8">
            Chez VELORA, nous accordons une grande importance à la protection de vos
            données personnelles. Cette politique de confidentialité vous informe sur
            la manière dont nous collectons, utilisons et protégeons vos informations.
          </p>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              1. Données collectées
            </h2>
            <p>Nous collectons les données suivantes :</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Données d'identification :</strong> nom, prénom, adresse email, numéro de téléphone</li>
              <li><strong>Données de livraison :</strong> adresse postale</li>
              <li><strong>Données de transaction :</strong> historique des commandes, montants</li>
              <li><strong>Données de navigation :</strong> cookies, pages visitées, durée de visite</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              2. Utilisation des données
            </h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Traiter et livrer vos commandes</li>
              <li>Vous envoyer des confirmations et mises à jour de commande</li>
              <li>Répondre à vos demandes de service client</li>
              <li>Améliorer notre site et nos services</li>
              <li>Vous envoyer des communications marketing (avec votre consentement)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              3. Base légale du traitement
            </h2>
            <p>Le traitement de vos données repose sur :</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>L'exécution du contrat :</strong> pour traiter vos commandes</li>
              <li><strong>Le consentement :</strong> pour les communications marketing</li>
              <li><strong>L'intérêt légitime :</strong> pour améliorer nos services</li>
              <li><strong>Les obligations légales :</strong> conservation des factures</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              4. Partage des données
            </h2>
            <p>
              Vos données peuvent être partagées avec nos prestataires de services :
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Stripe :</strong> traitement des paiements</li>
              <li><strong>Transporteurs :</strong> livraison des colis</li>
              <li><strong>Resend :</strong> envoi des emails transactionnels</li>
              <li><strong>Supabase :</strong> hébergement des données</li>
            </ul>
            <p className="mt-4">
              Nous ne vendons jamais vos données personnelles à des tiers.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              5. Conservation des données
            </h2>
            <p>Vos données sont conservées pendant :</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Données clients :</strong> 3 ans après la dernière commande</li>
              <li><strong>Données de facturation :</strong> 10 ans (obligation légale)</li>
              <li><strong>Cookies :</strong> 13 mois maximum</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              6. Vos droits
            </h2>
            <p>
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Droit d'accès :</strong> obtenir une copie de vos données</li>
              <li><strong>Droit de rectification :</strong> corriger vos données</li>
              <li><strong>Droit à l'effacement :</strong> supprimer vos données</li>
              <li><strong>Droit d'opposition :</strong> vous opposer au traitement</li>
              <li><strong>Droit à la portabilité :</strong> récupérer vos données</li>
              <li><strong>Droit de limitation :</strong> limiter le traitement</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à : <strong>contact@velorabeauty.fr</strong>
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              7. Cookies
            </h2>
            <p>
              Notre site utilise des cookies pour :
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li><strong>Cookies essentiels :</strong> fonctionnement du panier et du paiement</li>
              <li><strong>Cookies analytiques :</strong> mesure d'audience (anonymisée)</li>
            </ul>
            <p className="mt-4">
              Vous pouvez gérer vos préférences de cookies dans les paramètres de
              votre navigateur.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              8. Sécurité
            </h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger
              vos données :
            </p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>Chiffrement SSL/TLS 256-bit</li>
              <li>Paiements sécurisés via Stripe (certifié PCI-DSS)</li>
              <li>Accès restreint aux données personnelles</li>
              <li>Hébergement sécurisé</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              9. Contact
            </h2>
            <p>
              Pour toute question concernant cette politique ou vos données
              personnelles, contactez notre délégué à la protection des données :
            </p>
            <p className="mt-4">
              <strong>Email :</strong> contact@velorabeauty.fr<br />
              <strong>Objet :</strong> Protection des données
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-heading text-2xl font-semibold text-primary mb-4">
              10. Réclamation
            </h2>
            <p>
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez
              introduire une réclamation auprès de la CNIL (Commission Nationale
              de l'Informatique et des Libertés) : <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline"
              >www.cnil.fr</a>
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
