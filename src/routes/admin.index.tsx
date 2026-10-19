import { createFileRoute, redirect } from "@tanstack/react-router";
import { hasAdminAccess } from "@/novalestic/admin/access";
import { AdminDashboard } from "@/novalestic/admin/AdminDashboard";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  beforeLoad: async () => {
    if (!(await hasAdminAccess())) throw redirect({ to: "/admin/login" });
  },
  head: () => ({
    meta: [
      { title: "Catalogue admin — Novalestic Jewellers" },
      { name: "description", content: "Manage Novalestic Jewellers products." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Catalogue admin — Novalestic Jewellers" },
      { property: "og:description", content: "Private catalogue administration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminDashboard,
});
