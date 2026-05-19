'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, TrendingDown, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/format';
import { CATEGORY_COLORS } from '@/lib/categories';
import { FadeIn, Stagger, StaggerItem } from '@/components/ui/animate';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

const ExpensePieChart = dynamic(() => import('@/components/dashboard/expense-pie-chart'), { ssr: false, loading: () => <div className="h-[300px] flex items-center justify-center"><Skeleton className="w-full h-full rounded-lg" /></div> }) as any;
const MonthlyBarChart = dynamic(() => import('@/components/dashboard/monthly-bar-chart'), { ssr: false, loading: () => <div className="h-[300px] flex items-center justify-center"><Skeleton className="w-full h-full rounded-lg" /></div> }) as any;

interface DashboardData {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  savingsRate: number;
  categoryData: Array<{ name: string; value: number }>;
  monthlyData: Array<{ month: string; rendas: number; gastos: number }>;
  recentTransactions: Array<any>;
}

export function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r: any) => r?.json?.())
      .then((d: any) => { if (d && !d?.error) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i: number) => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Saldo do Mês', value: data?.balance ?? 0, icon: Wallet, color: 'text-primary', bgColor: 'bg-primary/10' },
    { label: 'Rendas do Mês', value: data?.totalIncome ?? 0, icon: TrendingUp, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
    { label: 'Gastos do Mês', value: data?.totalExpense ?? 0, icon: TrendingDown, color: 'text-red-500', bgColor: 'bg-red-500/10' },
    { label: 'Economia', value: data?.savingsRate ?? 0, icon: Percent, color: (data?.savingsRate ?? 0) >= 0 ? 'text-emerald-500' : 'text-red-500', bgColor: (data?.savingsRate ?? 0) >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10', isSavings: true },
  ];

  return (
    <div className="space-y-6">
      <FadeIn>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Visão geral das suas finanças no mês atual.</p>
        </div>
      </FadeIn>

      <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c: any, i: number) => (
          <StaggerItem key={i}>
            <Card variant="interactive">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground font-medium">{c?.label}</span>
                  <div className={`w-9 h-9 rounded-lg ${c?.bgColor} flex items-center justify-center`}>
                    <c.icon className={`w-5 h-5 ${c?.color}`} />
                  </div>
                </div>
                <div className={`text-2xl font-bold font-mono ${c?.color}`}>
                  {c?.isSavings ? `${c?.value?.toFixed?.(1) ?? '0'}%` : formatCurrency(c?.value)}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="grid md:grid-cols-2 gap-6">
        <FadeIn delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gastos por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              {(data?.categoryData?.length ?? 0) > 0 ? (
                <ExpensePieChart data={data?.categoryData ?? []} />
              ) : (
                <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
                  Nenhum gasto registrado neste mês
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rendas vs Gastos</CardTitle>
            </CardHeader>
            <CardContent>
              <MonthlyBarChart data={data?.monthlyData ?? []} />
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <FadeIn delay={0.3}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.recentTransactions?.length ?? 0) > 0 ? (
              <div className="space-y-2">
                {(data?.recentTransactions ?? []).map((t: any, i: number) => (
                  <div key={t?.id ?? i} className="flex items-center justify-between py-2.5 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t?.type === 'income' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                        {t?.type === 'income' ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t?.category ?? 'Sem categoria'}</p>
                        <p className="text-xs text-muted-foreground">{t?.description || formatDate(t?.date)}</p>
                      </div>
                    </div>
                    <span className={`font-mono font-semibold text-sm ${t?.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {t?.type === 'income' ? '+' : '-'}{formatCurrency(t?.amount ?? 0)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-8">Nenhuma transação registrada ainda.</p>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
