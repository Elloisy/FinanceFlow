'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

export function AppHeader() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; name: string | null } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r: any) => r?.json?.())
      .then((d: any) => { if (d?.user) setUser(d.user); })
      .catch(() => {});
  }, []);

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
    <div className="flex items-center justify-between w-full">
      <div />
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>{user?.name || user?.email || 'Carregando...'}</span>
        </div>
        <ThemeToggle />
        <Button variant="ghost" size="icon" onClick={handleLogout} title="Sair">
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
