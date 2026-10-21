import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { hasAdminAccess } from "@/novalestic/admin/access";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  beforeLoad: async () => {
    if (!(await hasAdminAccess())) throw redirect({ to: "/admin/login" });
    const { data } = await supabase.auth.getUser();
    return { email: data.user?.email ?? "" };
  },
  head: () => ({
    meta: [
      { title: "Admin — Novalestic Jewellers" },
      { name: "description", content: "Novalestic Jewellers administration." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin — Novalestic Jewellers" },
      { property: "og:description", content: "Private administration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminHome,
});

function AdminHome() {
  const { email } = Route.useRouteContext();
  const navigate = useNavigate();
  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  };
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between rounded-2xl border border-border bg-card p-5">
          <div>
            <h1 className="font-serif text-2xl text-foreground">Novalestic Admin</h1>
            <p className="text-sm text-muted-foreground">Signed in as {email}</p>
          </div>
          <button onClick={signOut} className="rounded-full border border-border px-4 py-2 text-sm text-foreground hover:bg-accent">
            Sign out
          </button>
        </header>
        <p className="mt-6 text-sm text-muted-foreground">Welcome. Admin tools will appear here.</p>
      </div>
    </main>
  );
}
