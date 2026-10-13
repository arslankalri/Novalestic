import { createFileRoute, redirect } from '@tanstack/react-router';
import { hasAdminAccess } from '@/novalestic/admin/access';
import { AdminOperations } from '@/novalestic/admin/AdminOperations';
export const Route = createFileRoute('/admin/overview')({
  ssr: false,
  beforeLoad: async () => { if (!(await hasAdminAccess())) throw redirect({ to: '/admin/login' }); },
  head: () => ({ meta: [{ title: 'Business overview — Novalestic Jewellers' }, { name: 'robots', content: 'noindex, nofollow' }] }),
  component: () => <AdminOperations mode="dashboard" />,
});
