'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, TrendingUp, TrendingDown, Settings, DollarSign, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/incomes', label: 'Rendas', icon: TrendingUp },
  { href: '/expenses', label: 'Gastos', icon: TrendingDown },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Saiu com sucesso');
      router.replace('/login');
    } catch {
      toast.error('Erro ao sair');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Link href="/dashboard" className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg finance-gradient flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-white" />
        </div>
        <span className="font-display text-lg font-bold tracking-tight">FinanceFlow</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map((item: any) => {
          const isActive = pathname === item?.href || pathname?.startsWith((item?.href ?? '') + '/');
          return (
            <Link
              key={item?.href}
              href={item?.href ?? '#'}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-fast',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item?.label}
            </Link>
          );
        })}
      </nav>

      <Button variant="ghost" className="justify-start text-muted-foreground mt-auto" onClick={handleLogout}>
        <LogOut className="w-5 h-5 mr-3" /> Sair
      </Button>
    </div>
  );
}
