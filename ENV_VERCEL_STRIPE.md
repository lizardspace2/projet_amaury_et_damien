## Variables d’environnement à ajouter sur Vercel (Stripe + Supabase)

Ajoutez ces variables dans Vercel > Project > Settings > Environment Variables.

- STRIPE_SECRET_KEY: clé secrète Stripe (ex: sk_live_...)
- STRIPE_PRICE_ID_PRO_PLUS: ID de prix récurrent pour l’abonnement (ex: price_12345)
- STRIPE_WEBHOOK_SECRET: secret de signature du webhook Stripe (ex: whsec_...)
- SUPABASE_URL: URL de votre instance Supabase (ex: https://xyzcompany.supabase.co)
- SUPABASE_SERVICE_ROLE_KEY: clé service role Supabase
- APP_BASE_URL: domaine de l’app sans protocole (ex: mon-app.vercel.app)

Optionnel (utile en dev local avec Vite):
- VITE_API_BASE_URL: URL de base pour pointer sur l’API déployée (ex: https://mon-app.vercel.app)

Notes importantes:
- APP_BASE_URL doit être SANS https:// ni http:// car le code construit https://${APP_BASE_URL}
- Sur Vercel, VERCEL_URL est défini automatiquement. APP_BASE_URL peut être omis si VERCEL_URL convient.

### Où trouver chaque valeur

Stripe:
1) STRIPE_SECRET_KEY
   - Stripe Dashboard > Developers > API Keys > Secret key.
   - Utilisez la clé live en production, test en staging.

2) STRIPE_PRICE_ID_PRO_PLUS
   - Stripe Dashboard > Products > choisissez le produit > Prices > prenez l’ID (ex: price_...).
   - Créez un prix récurrent mensuel si nécessaire.

3) STRIPE_WEBHOOK_SECRET
   - Stripe Dashboard > Developers > Webhooks > Add endpoint.
   - Endpoint URL: https://YOUR_DOMAIN/api/stripe/webhook
   - Sélectionnez au minimum: checkout.session.completed, customer.subscription.deleted, customer.subscription.updated.
   - Une fois le webhook créé, récupérez le “Signing secret” (whsec_...).

Supabase:
1) SUPABASE_URL
   - Supabase > Project Settings > API > Project URL.

2) SUPABASE_SERVICE_ROLE_KEY
   - Supabase > Project Settings > API > Service role key.
   - Attention: clé très sensible; ne l’exposez jamais côté client.

Vercel:
1) APP_BASE_URL
   - Mettez le domaine du déploiement sans protocole, ex: mon-app.vercel.app
   - En preview/production, vous pouvez laisser vide si VERCEL_URL fonctionne, sinon fixez APP_BASE_URL.

2) VITE_API_BASE_URL (optionnel pour le dev local)
   - Créez un fichier .env.local dans votre projet avec:
     VITE_API_BASE_URL=https://mon-app.vercel.app
   - Redémarrez le serveur Vite.

### Vérifications rapides
- Lancement du checkout: /api/stripe/create-checkout-session doit répondre 200 avec une URL.
- Portail client: /api/stripe/create-portal-session doit répondre 200 avec une URL.
- Webhook: testez via Stripe CLI ou l’outil “Send test event” sur le webhook.

### URLs utilisées par le code
- Checkout success: https://${APP_BASE_URL}/billing/success
- Checkout cancel: https://${APP_BASE_URL}/billing/cancel
- Webhook: https://${APP_BASE_URL}/api/stripe/webhook


