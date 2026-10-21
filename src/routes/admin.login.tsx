import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { hasAdminAccess } from "@/novalestic/admin/access";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin sign in — Novalestic Jewellers" },
      { name: "description", content: "Private sign in for Novalestic Jewellers administrators." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin sign in — Novalestic Jewellers" },
      { property: "og:description", content: "Private administration sign in." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session || cancelled) return;
      setBusy(true);
      if (await hasAdminAccess()) {
        if (!cancelled) navigate({ to: "/admin", replace: true });
        return;
      }
      await supabase.auth.signOut();
      if (!cancelled) {
        setError("This Google account does not have administrator access.");
        setBusy(false);
      }
    };
    void check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") window.setTimeout(() => void check(), 0);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async () => {
    setBusy(true);
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/admin/login`,
      extraParams: { prompt: "select_account", login_hint: "arslankalri@gmail.com" },
    });
    if (result.error) {
      setError("Google sign-in could not start. Please try again.");
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Novalestic</p>
        <h1 className="mt-3 font-serif text-3xl text-foreground">Admin sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in with the owner Google account.</p>
        <button
          onClick={signIn}
          disabled={busy}
          className="mt-8 w-full rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          {busy ? "Please wait…" : "Continue with Google"}
        </button>
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      </div>
    </main>
  );
}
