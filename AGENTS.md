<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The app is Novalestic Jewellers, a jewellery storefront ported from an external Vite SPA. Its code lives in `src/novalestic/` (App.tsx, components, context, data, types) and is mounted by the index route; it manages its own view switching internally via ShopContext (no TanStack routes per view). Shop state persists in localStorage; keep `typeof window` guards in state initializers for SSR. Store prices are in PKR.

- Admin portal lives at /admin/login and /admin (client-only routes, src/novalestic/admin/); all catalogue writes go through the browser client and are enforced by database RLS via novalestic_has_admin_access() — why: no service key in the frontend, the database is the security boundary.
- Product photos use a private bucket with long-lived signed URLs stored on rows — why: the workspace blocks public buckets.
