# Novalestic Jewellers

A React, TypeScript, Vite, and TanStack Start storefront for fine jewellery with prices displayed in Pakistani rupees (PKR).

## Current scope

- Public jewellery catalogue and product details
- Browser-local cart and order-request preview
- No public admin portal
- No central order database, authenticated owner dashboard, payment gateway, or newsletter delivery is configured yet

**Important:** order requests are currently prepared in the visitor's browser. They are not saved to a central server. Do not treat this as production checkout until a backend, owner authentication, server-side order persistence, and verified order delivery are implemented.

## Development

Use the package manager represented by the repository lockfile (Bun):

- Install dependencies: bun install
- Start development: bun run dev
- Lint: bun run lint
- Tests: bun run test
- Production build: bun run build

This project is connected to Lovable. Changes pushed to the connected branch may sync to Lovable; avoid rewriting published Git history.
