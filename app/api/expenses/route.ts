export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const category = searchParams.get('category');

    const where: any = { userId: session.id };

    if (month) {
      const [y, m] = month.split('-').map(Number);
      if (y && m) {
        where.date = {
          gte: new Date(y, m - 1, 1),
          lt: new Date(y, m, 1),
        };
      }
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    const total = expenses.reduce((sum: number, e: any) => sum + (e?.amount ?? 0), 0);

    return NextResponse.json({ expenses, total });
  } catch (error: any) {
    console.error('Get expenses error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const body = await request.json();
    const { amount, category, date, description } = body ?? {};

    if (!amount || !category || !date) {
      return NextResponse.json({ error: 'Campos obrigatórios: valor, categoria, data' }, { status: 400 });
    }

    const expense = await prisma.expense.create({
      data: {
        userId: session.id,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
        description: description || null,
      },
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error: any) {
    console.error('Create expense error:', error);
    return NextResponse.json({ error: 'Erro ao criar gasto' }, { status: 500 });
  }
}
