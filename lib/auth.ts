import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const TOKEN_NAME = 'ff_session';

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
}

export function generateToken(user: SessionUser): string {
  return jwt.sign({ id: user?.id, email: user?.email, name: user?.name }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyToken(token: string): SessionUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded?.id ?? '',
      email: decoded?.email ?? '',
      name: decoded?.name ?? null,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    if (!token) return null;
    const user = verifyToken(token);
    if (!user?.id) return null;
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) return null;
    return { id: dbUser.id, email: dbUser.email, name: dbUser.name };
  } catch {
    return null;
  }
}

export function getTokenName(): string {
  return TOKEN_NAME;
}
