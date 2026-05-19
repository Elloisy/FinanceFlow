export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body?.name?.trim();
    const email = body?.email?.trim();
    const subject = body?.subject?.trim() || null;
    const message = body?.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, message: 'Preencha todos os campos obrigatórios' }, { status: 400 });
    }

    // Save to database
    await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    // Send notification email
    const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    let senderEmail = 'noreply@mail.abacusai.app';
    try { senderEmail = `noreply@${new URL(appUrl).hostname}`; } catch {}

    const htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #3B82F6; font-size: 24px; margin: 0;">FinanceFlow</h1>
          <p style="color: #6B7280; font-size: 13px;">Nova mensagem do formulário de contato</p>
        </div>
        <div style="background: #F9FAFB; border-radius: 12px; padding: 24px;">
          <p style="margin: 8px 0;"><strong>Nome:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong>E-mail:</strong> <a href="mailto:${email}">${email}</a></p>
          ${subject ? `<p style="margin: 8px 0;"><strong>Assunto:</strong> ${subject}</p>` : ''}
          <div style="margin-top: 16px; background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #3B82F6;">
            <strong>Mensagem:</strong><br/><br/>${message?.replace(/\n/g, '<br/>')}
          </div>
        </div>
        <p style="color: #9CA3AF; font-size: 11px; text-align: center; margin-top: 16px;">Enviado via FinanceFlow</p>
      </div>
    `;

    await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        app_id: process.env.WEB_APP_ID,
        notification_id: process.env.NOTIF_ID_FORMULRIO_DE_CONTATO,
        subject: `[FinanceFlow] Nova mensagem de ${name}${subject ? `: ${subject}` : ''}`,
        body: htmlBody,
        is_html: true,
        recipient_email: 'ello-isy@hotmail.com',
        reply_to: email,
        sender_email: senderEmail,
        sender_alias: 'FinanceFlow',
      }),
    }).catch((err: any) => console.error('Contact email error:', err));

    return NextResponse.json({ success: true, message: 'Mensagem enviada com sucesso!' });
  } catch (error: any) {
    console.error('Contact error:', error);
    return NextResponse.json({ success: false, message: 'Erro ao enviar mensagem' }, { status: 500 });
  }
}
