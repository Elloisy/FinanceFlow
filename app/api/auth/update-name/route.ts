export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, message: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const name = body?.name?.trim();

    if (!name) {
      return NextResponse.json({ success: false, message: 'Nome é obrigatório' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.id },
      data: { name },
    });

    return NextResponse.json({ success: true, message: 'Nome atualizado com sucesso' });
  } catch (error: any) {
    console.error('Update name error:', error);
    return NextResponse.json({ success: false, message: 'Erro interno' }, { status: 500 });
  }
}
