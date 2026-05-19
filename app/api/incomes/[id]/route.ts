export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const existing = await prisma.income.findFirst({ where: { id: params.id, userId: session.id } });
    if (!existing) return NextResponse.json({ error: 'Renda não encontrada' }, { status: 404 });

    const body = await request.json();
    const { amount, category, date, description } = body ?? {};

    const income = await prisma.income.update({
      where: { id: params.id },
      data: {
        ...(amount !== undefined && { amount: parseFloat(amount) }),
        ...(category !== undefined && { category }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(description !== undefined && { description: description || null }),
      },
    });

    return NextResponse.json({ income });
  } catch (error: any) {
    console.error('Update income error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const existing = await prisma.income.findFirst({ where: { id: params.id, userId: session.id } });
    if (!existing) return NextResponse.json({ error: 'Renda não encontrada' }, { status: 404 });

    await prisma.income.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete income error:', error);
    return NextResponse.json({ error: 'Erro ao excluir' }, { status: 500 });
  }
}
