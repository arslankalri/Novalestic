# NOVALESTIC JEWELLERS

NOVALESTIC is a jewellery storefront project focused on a refined, mobile-friendly shopping experience for customers browsing jewellery priced in Pakistani rupees (PKR).

## Current status

The current storefront is a design preview. Product names, images, descriptions, specifications and prices are sample content used to develop the interface; they are not confirmed inventory or live offers. The cart is a front-end preview and checkout, payments, order submission, stock management, analytics and customer accounts are not connected to a production backend yet.

## Planned development

1. Finish and review the public storefront UI and responsive behaviour.
2. Prepare the catalogue model for verified products and product variants.
3. Finish cart behaviour and prepare the checkout integration points without accepting real orders prematurely.
4. Later, connect a cloud backend and build a private admin portal for authorised store managers.
5. Add secure order processing, analytics, delivery and payment integrations after their requirements and providers are confirmed.

## Development

This project uses React, TypeScript, Vite and Tailwind CSS. Install dependencies using the package manager and lockfile included in the repository, then run the scripts defined in `package.json`.

```sh
npm install
npm run dev
npm run build
npm run lint
```

Use the repository's existing workflow and default branch. Do not put secrets, payment credentials, customer data or private admin credentials in client-side code or source control.
