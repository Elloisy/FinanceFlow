import { AppShell } from '@/components/layouts/app-shell';
import { SidebarNav } from '@/components/app/sidebar-nav';
import { AppHeader } from '@/components/app/app-header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell sidebar={<SidebarNav />} header={<AppHeader />}>
      {children}
    </AppShell>
  );
}
