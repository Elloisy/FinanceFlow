'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, DollarSign, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { toast } from 'sonner';

export function LoginClient() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email?.trim()) {
      toast.error('Digite seu e-mail');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email?.trim() }),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success('Código enviado para ' + email);
        setStep('code');
      } else {
        toast.error(data?.message || 'Erro ao enviar código');
      }
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code?.trim() || code?.length !== 6) {
      toast.error('Digite o código de 6 dígitos');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email?.trim(), code: code?.trim() }),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success('Login realizado!');
        router.replace('/dashboard');
      } else {
        toast.error(data?.message || 'Código inválido');
      }
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 hero-gradient">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl finance-gradient flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight">FinanceFlow</span>
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {step === 'email' ? (
            <motion.div key="email" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Card>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="font-display text-2xl tracking-tight">Entrar</CardTitle>
                  <CardDescription>Digite seu e-mail para receber um código de acesso.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={sendCode} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">E-mail</label>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e: any) => setEmail(e?.target?.value ?? '')}
                        autoFocus
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                      {loading ? 'Enviando...' : 'Enviar código'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div key="code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card>
                <CardHeader className="text-center">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="font-display text-2xl tracking-tight">Verificar código</CardTitle>
                  <CardDescription>Enviamos um código de 6 dígitos para <strong>{email}</strong></CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={verifyCode} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Código</label>
                      <Input
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        value={code}
                        onChange={(e: any) => setCode((e?.target?.value ?? '').replace(/\D/g, '').slice(0, 6))}
                        className="text-center text-2xl font-mono tracking-[0.5em]"
                        autoFocus
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading || (code?.length ?? 0) !== 6}>
                      {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      {loading ? 'Verificando...' : 'Entrar'}
                    </Button>
                    <div className="flex items-center justify-between">
                      <Button type="button" variant="ghost" size="sm" onClick={() => { setStep('email'); setCode(''); }}>
                        <ArrowLeft className="w-4 h-4 mr-1" /> Voltar
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={sendCode} disabled={loading}>
                        Reenviar código
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
