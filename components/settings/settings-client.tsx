'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Save, Loader2 } from 'lucide-react';
import { FadeIn } from '@/components/ui/animate';
import { toast } from 'sonner';

export function SettingsClient() {
  const [user, setUser] = useState<{ email: string; name: string | null } | null>(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r: any) => r?.json?.())
      .then((d: any) => {
        if (d?.user) {
          setUser(d.user);
          setName(d.user?.name ?? '');
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name?.trim()) {
      toast.error('Digite seu nome');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/auth/update-name', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name?.trim() }),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success('Nome atualizado!');
      } else {
        toast.error(data?.message || 'Erro ao atualizar');
      }
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <FadeIn>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground text-sm mt-1">Gerencie suas informações pessoais.</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Perfil</CardTitle>
            <CardDescription>Atualize seu nome de exibição.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">E-mail</label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-muted-foreground text-sm">
                  <Mail className="w-4 h-4" />
                  {user?.email ?? 'Carregando...'}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Nome</label>
                <Input
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e: any) => setName(e?.target?.value ?? '')}
                />
              </div>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
