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
- The legacy Supabase-backed admin portal and custom catalogue database are being retired. There is currently no `/admin` route or configured product backend. The storefront product loader intentionally returns an empty collection while the Laravel backend is planned.
- Do not recreate the old admin schema or Google-login flow as part of routine changes. The user plans to build the admin/backend in Laravel and choose the authentication integration separately.
