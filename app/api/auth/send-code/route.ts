export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim()?.toLowerCase();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, message: 'E-mail é obrigatório' }, { status: 400 });
    }

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({ data: { email } });
    }

    // Invalidate old codes
    await prisma.verificationCode.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    // Send email via notification API
    const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    let appName = 'FinanceFlow';
    try { appName = new URL(appUrl).hostname?.split('.')?.[0] || 'FinanceFlow'; } catch {}

    const htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 0;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #3B82F6; font-size: 28px; margin: 0;">FinanceFlow</h1>
          <p style="color: #6B7280; font-size: 14px; margin-top: 4px;">Gestão de Finanças Pessoais</p>
        </div>
        <div style="background: #F9FAFB; border-radius: 12px; padding: 32px; text-align: center;">
          <p style="color: #374151; font-size: 16px; margin: 0 0 8px;">Seu código de verificação é:</p>
          <div style="background: white; border: 2px solid #3B82F6; border-radius: 8px; padding: 16px 24px; display: inline-block; margin: 16px 0;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #1E40AF; font-family: monospace;">${code}</span>
          </div>
          <p style="color: #6B7280; font-size: 13px; margin-top: 16px;">Este código expira em <strong>10 minutos</strong>.</p>
          <p style="color: #9CA3AF; font-size: 12px; margin-top: 8px;">Se você não solicitou este código, ignore este e-mail.</p>
        </div>
      </div>
    `;

    let senderEmail = 'noreply@mail.abacusai.app';
    try { senderEmail = `noreply@${new URL(appUrl).hostname}`; } catch {}

    const emailResponse = await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        app_id: process.env.WEB_APP_ID,
        notification_id: process.env.NOTIF_ID_CDIGO_DE_VERIFICAO,
        subject: `${code} - Seu código de acesso FinanceFlow`,
        body: htmlBody,
        is_html: true,
        recipient_email: email,
        sender_email: senderEmail,
        sender_alias: 'FinanceFlow',
      }),
    });

    const emailResult = await emailResponse.json();
    if (!emailResult?.success && !emailResult?.notification_disabled) {
      console.error('Email send failed:', emailResult);
      return NextResponse.json({ success: false, message: 'Erro ao enviar e-mail. Tente novamente.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Código enviado para seu e-mail' });
  } catch (error: any) {
    console.error('Send code error:', error);
    return NextResponse.json({ success: false, message: 'Erro interno do servidor' }, { status: 500 });
  }
}
