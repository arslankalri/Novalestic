import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
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
  };

  return (
    <main className="min-h-screen bg-[#fbf9f4] flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm bg-white border border-[#e4e2dd] p-8 space-y-5"
      >
        <div>
          <h1 className="serif-luxury text-2xl text-[#1b1c19]">Novalestic Admin</h1>
          <p className="text-sm text-[#7f7575] mt-1">Authorised staff only.</p>
        </div>
        <label className="block text-sm">
          <span className="text-[#4d4544]">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-[#d0c4c3] px-3 py-2 bg-white"
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
            className="mt-1 w-full border border-[#d0c4c3] px-3 py-2 bg-white"
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
          className="w-full bg-[#002118] text-[#DFC27F] py-2.5 text-sm tracking-widest uppercase disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
