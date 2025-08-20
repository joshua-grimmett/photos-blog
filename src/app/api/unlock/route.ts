import { NextResponse } from 'next/server';
import { env } from '~/app/utils/env';

const COOKIE_NAME = 'site_pass';

export async function POST(req: Request) {
  const { code } = await req.json().catch(() => ({ code: '' }));
  if (code === env.SITE_PASSCODE) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE_NAME, env.SITE_PASSCODE, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
