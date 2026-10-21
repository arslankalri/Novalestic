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

- The app is Novalestic Jewellers, a public jewellery storefront implemented in `src/novalestic/`. Its views are selected by `ShopContext`; prices are in PKR and the cart is browser-local.
- Admin access uses Lovable Cloud Google sign-in at `/admin/login`; `/admin` is gated client-side (`ssr: false`) by an `admin` row in `public.user_roles`, granted by a trigger only to the owner's verified email. Why: roles must never come from client state.
- There is no product backend yet; the storefront product loader intentionally returns an empty collection.
