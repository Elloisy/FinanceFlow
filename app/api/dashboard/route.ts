export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getMonthName } from '@/lib/format';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    // Current month totals
    const monthIncomes = await prisma.income.findMany({
      where: { userId: session.id, date: { gte: startOfMonth, lt: endOfMonth } },
    });
    const monthExpenses = await prisma.expense.findMany({
      where: { userId: session.id, date: { gte: startOfMonth, lt: endOfMonth } },
    });

    const totalIncome = monthIncomes.reduce((s: number, i: any) => s + (i?.amount ?? 0), 0);
    const totalExpense = monthExpenses.reduce((s: number, e: any) => s + (e?.amount ?? 0), 0);
    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

    // Expenses by category (current month)
    const expensesByCategory: Record<string, number> = {};
    monthExpenses.forEach((e: any) => {
      const cat = e?.category ?? 'Outros';
      expensesByCategory[cat] = (expensesByCategory[cat] ?? 0) + (e?.amount ?? 0);
    });
    const categoryData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }));

    // Last 6 months comparison
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextD = new Date(d.getFullYear(), d.getMonth() + 1, 1);

      const mIncomes = await prisma.income.aggregate({
        where: { userId: session.id, date: { gte: d, lt: nextD } },
        _sum: { amount: true },
      });
      const mExpenses = await prisma.expense.aggregate({
        where: { userId: session.id, date: { gte: d, lt: nextD } },
        _sum: { amount: true },
      });

      monthlyData.push({
        month: getMonthName(d.getMonth()),
        rendas: Math.round((mIncomes?._sum?.amount ?? 0) * 100) / 100,
        gastos: Math.round((mExpenses?._sum?.amount ?? 0) * 100) / 100,
      });
    }

    // Recent transactions
    const recentIncomes = await prisma.income.findMany({
      where: { userId: session.id },
      orderBy: { date: 'desc' },
      take: 5,
    });
    const recentExpenses = await prisma.expense.findMany({
      where: { userId: session.id },
      orderBy: { date: 'desc' },
      take: 5,
    });

    const recentTransactions = [
      ...recentIncomes.map((i: any) => ({ ...i, type: 'income' as const })),
      ...recentExpenses.map((e: any) => ({ ...e, type: 'expense' as const })),
    ].sort((a: any, b: any) => new Date(b?.date ?? 0).getTime() - new Date(a?.date ?? 0).getTime()).slice(0, 10);

    return NextResponse.json({
      balance: Math.round(balance * 100) / 100,
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpense: Math.round(totalExpense * 100) / 100,
      savingsRate: Math.round(savingsRate * 10) / 10,
      categoryData,
      monthlyData,
      recentTransactions,
    });
  } catch (error: any) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
