'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Wallet, TrendingUp, PieChart, Shield, Zap, BarChart3,
  ArrowRight, Mail, Send, CheckCircle2, Menu, X,
  DollarSign, Target, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FadeIn, SlideIn, Stagger, StaggerItem, ScaleIn } from '@/components/ui/animate';
import { toast } from 'sonner';

const features = [
  { icon: Wallet, title: 'Controle Total', desc: 'Gerencie rendas e gastos em um só lugar com visão completa das suas finanças.' },
  { icon: PieChart, title: 'Gráficos Inteligentes', desc: 'Visualize para onde vai seu dinheiro com gráficos claros e intuitivos.' },
  { icon: Shield, title: 'Seguro e Simples', desc: 'Login sem senha, com código por e-mail. Seus dados protegidos com criptografia.' },
];

const steps = [
  { num: '01', title: 'Acesse com seu e-mail', desc: 'Sem senha para lembrar. Receba um código no e-mail e entre instant.' },
  { num: '02', title: 'Registre suas movimentações', desc: 'Adicione rendas e gastos com categorias para organizar tudo.' },
  { num: '03', title: 'Acompanhe seus resultados', desc: 'Veja gráficos e resumos que mostram sua evolução financeira.' },
];

const benefits = [
  { icon: Zap, title: 'Rápido', desc: 'Interface leve e responsiva' },
  { icon: Target, title: 'Focado', desc: 'Apenas o essencial para suas finanças' },
  { icon: BarChart3, title: 'Visual', desc: 'Gráficos que facilitam a análise' },
  { icon: Sparkles, title: 'Moderno', desc: 'Dark mode e design elegante' },
];

export function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success('Mensagem enviada com sucesso!');
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data?.message || 'Erro ao enviar');
      }
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg finance-gradient flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">FinanceFlow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild><a href="#funcionalidades">Funcionalidades</a></Button>
            <Button variant="ghost" size="sm" asChild><a href="#como-funciona">Como Funciona</a></Button>
            <Button variant="ghost" size="sm" asChild><a href="#contato">Contato</a></Button>
            <ThemeToggle />
            <Button asChild size="sm" className="ml-2">
              <Link href="/login">Entrar <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="md:hidden border-t bg-background p-4 space-y-2">
            <a href="#funcionalidades" className="block px-3 py-2 rounded-lg hover:bg-muted" onClick={() => setMobileMenu(false)}>Funcionalidades</a>
            <a href="#como-funciona" className="block px-3 py-2 rounded-lg hover:bg-muted" onClick={() => setMobileMenu(false)}>Como Funciona</a>
            <a href="#contato" className="block px-3 py-2 rounded-lg hover:bg-muted" onClick={() => setMobileMenu(false)}>Contato</a>
            <Button asChild className="w-full mt-2"><Link href="/login">Entrar</Link></Button>
          </motion.div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden hero-gradient">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-32 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Gestão financeira simplificada
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
              Suas finanças no <span className="finance-gradient-text">controle</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
              Registre rendas e gastos, visualize gráficos e acompanhe sua evolução financeira de forma simples e elegante.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild>
                <Link href="/login">Começar agora <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#funcionalidades">Saiba mais</a>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Tudo que você precisa</h2>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto">Ferramentas essenciais para o controle financeiro pessoal.</p>
            </div>
          </FadeIn>
          <Stagger className="grid md:grid-cols-3 gap-6">
            {features.map((f: any, i: number) => (
              <StaggerItem key={i}>
                <Card variant="interactive" className="h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl finance-gradient flex items-center justify-center mb-4">
                      <f.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2">{f?.title}</h3>
                    <p className="text-muted-foreground text-sm">{f?.desc}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="py-20 md:py-28 bg-muted/40">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Como funciona</h2>
              <p className="mt-3 text-muted-foreground">Três passos simples para começar.</p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s: any, i: number) => (
              <SlideIn key={i} from="bottom" delay={i * 0.15}>
                <div className="text-center">
                  <div className="text-5xl font-bold finance-gradient-text font-mono mb-4">{s?.num}</div>
                  <h3 className="font-display text-xl font-semibold mb-2">{s?.title}</h3>
                  <p className="text-muted-foreground text-sm">{s?.desc}</p>
                </div>
              </SlideIn>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Por que <span className="finance-gradient-text">FinanceFlow</span>?</h2>
            </div>
          </FadeIn>
          <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {benefits.map((b: any, i: number) => (
              <StaggerItem key={i}>
                <Card variant="interactive" className="text-center h-full">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <b.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{b?.title}</h3>
                    <p className="text-muted-foreground text-xs">{b?.desc}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Contact */}
      <section id="contato" className="py-20 md:py-28 bg-muted/40">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-lg mx-auto">
            <FadeIn>
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-display text-3xl font-bold tracking-tight">Entre em contato</h2>
                <p className="mt-2 text-muted-foreground text-sm">Dúvidas ou sugestões? Envie uma mensagem.</p>
              </div>
            </FadeIn>
            <ScaleIn delay={0.1}>
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleContact} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Nome *</label>
                      <Input placeholder="Seu nome" value={contactForm.name} onChange={(e: any) => setContactForm((p: any) => ({ ...(p ?? {}), name: e?.target?.value ?? '' }))} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">E-mail *</label>
                      <Input type="email" placeholder="seu@email.com" value={contactForm.email} onChange={(e: any) => setContactForm((p: any) => ({ ...(p ?? {}), email: e?.target?.value ?? '' }))} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Assunto</label>
                      <Input placeholder="Assunto (opcional)" value={contactForm.subject} onChange={(e: any) => setContactForm((p: any) => ({ ...(p ?? {}), subject: e?.target?.value ?? '' }))} />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Mensagem *</label>
                      <textarea className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background" placeholder="Sua mensagem..." value={contactForm.message} onChange={(e: any) => setContactForm((p: any) => ({ ...(p ?? {}), message: e?.target?.value ?? '' }))} />
                    </div>
                    <Button type="submit" className="w-full" disabled={sending}>
                      {sending ? 'Enviando...' : <><Send className="w-4 h-4 mr-2" /> Enviar mensagem</>}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">Seus dados serão usados apenas para responder à sua mensagem.</p>
                  </form>
                </CardContent>
              </Card>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded finance-gradient flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-semibold">FinanceFlow</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#funcionalidades" className="hover:text-foreground transition-colors">Funcionalidades</a>
            <a href="#contato" className="hover:text-foreground transition-colors">Contato</a>
            <Link href="/login" className="hover:text-foreground transition-colors">Entrar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
