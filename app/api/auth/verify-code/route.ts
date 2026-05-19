export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken, getTokenName } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim()?.toLowerCase();
    const code = body?.code?.trim();

    if (!email || !code) {
      return NextResponse.json({ success: false, message: 'E-mail e código são obrigatórios' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Código inválido ou expirado' }, { status: 400 });
    }

    const verification = await prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!verification) {
      return NextResponse.json({ success: false, message: 'Código inválido ou expirado' }, { status: 400 });
    }

    // Mark code as used
    await prisma.verificationCode.update({
      where: { id: verification.id },
      data: { used: true },
    });

    // Generate JWT token
    const token = generateToken({ id: user.id, email: user.email, name: user.name });

    const response = NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso',
      user: { id: user.id, email: user.email, name: user.name },
    });

    response.cookies.set(getTokenName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Verify code error:', error);
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 });
  }
}
