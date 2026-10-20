import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { hasAdminAccess } from "@/novalestic/admin/access";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin sign in — Novalestic Jewellers" },
      {
        name: "description",
        content: "Private sign in for Novalestic Jewellers catalogue administrators.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin sign in — Novalestic Jewellers" },
      { property: "og:description", content: "Private catalogue administration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let checkingSession = false;

    const finishSignIn = async () => {
      if (cancelled || checkingSession) return;
      checkingSession = true;

      const allowed = await hasAdminAccess();
      if (cancelled) return;

      if (allowed) {
        navigate({ to: "/admin", replace: true });
        return;
      }

      await supabase.auth.signOut();
      if (!cancelled) {
        setError("This account does not have administrator access.");
        setBusy(false);
      }
      checkingSession = false;
    };

    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void finishSignIn();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Defer the role lookup until after Supabase has released its auth-state lock.
      if (event === "SIGNED_IN" && session) {
        window.setTimeout(() => void finishSignIn(), 0);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(signInError.message);
        setBusy(false);
        return;
      }

      if (!(await hasAdminAccess())) {
        await supabase.auth.signOut();
        setError("This account does not have administrator access.");
        setBusy(false);
        return;
      }

      navigate({ to: "/admin", replace: true });
    } catch {
      setError("Sign-in failed. Please try again.");
      setBusy(false);
    }
  };

  const signInWithGoogle = async () => {
    setBusy(true);
    setError(null);

    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/admin/login`,
        extraParams: { prompt: "select_account" },
      });

      if (result.error) {
        setError("Google sign-in could not start. Please try again.");
        setBusy(false);
        return;
      }

      // The Lovable helper normally redirects to Google. When it returns tokens
      // directly, setSession triggers the auth-state listener above.
      if (result.redirected) return;

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        if (!(await hasAdminAccess())) {
          await supabase.auth.signOut();
          setError("This Google account does not have administrator access.");
          setBusy(false);
          return;
        }
        navigate({ to: "/admin", replace: true });
      } else {
        setError("Google sign-in did not complete. Please try again.");
        setBusy(false);
      }
    } catch {
      setError("Google sign-in could not start. Please try again.");
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf9f4] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-5 border border-[#e4e2dd] bg-white p-8"
      >
        <div>
          <h1 className="serif-luxury text-2xl text-[#1b1c19]">Novalestic Admin</h1>
          <p className="mt-1 text-sm text-[#7f7575]">Authorised staff only.</p>
        </div>

        <button
          type="button"
          onClick={() => void signInWithGoogle()}
          disabled={busy}
          className="flex w-full items-center justify-center gap-3 border border-[#d0c4c3] bg-white px-4 py-3 text-sm font-medium text-[#1b1c19] transition hover:bg-[#fbf9f4] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.05 13.22l7.98 6.19C12.76 13.72 17.92 9.5 24 9.5Z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.91 46.98 31.72 46.98 24.55Z" />
            <path fill="#FBBC05" d="M10.03 28.59A14.4 14.4 0 0 1 9.25 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.57 10.78l7.46-6.19Z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.17 2.3-6.08 0-11.24-4.22-12.97-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
          </svg>
          {busy ? "Opening sign-in…" : "Sign in with Google"}
        </button>

        <div className="flex items-center gap-3 text-xs text-[#9b9290]">
          <span className="h-px flex-1 bg-[#e8e0d4]" />
          <span>OR SIGN IN WITH EMAIL</span>
          <span className="h-px flex-1 bg-[#e8e0d4]" />
        </div>

        <label className="block text-sm">
          <span className="text-[#4d4544]">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-[#d0c4c3] bg-white px-3 py-2"
          />
        </label>

        <label className="block text-sm">
          <span className="text-[#4d4544]">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-[#d0c4c3] bg-white px-3 py-2"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-[#002118] py-2.5 text-sm uppercase tracking-widest text-[#DFC27F] disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
