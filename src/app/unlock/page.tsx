'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

export default function UnlockPage() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-[80vh] items-center justify-center'>
          Loading…
        </div>
      }
    >
      <UnlockForm />
    </Suspense>
  );
}

function UnlockForm() {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const sp = useSearchParams();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    if (res.ok) {
      const to = sp.get('from') || '/';
      router.replace(to);
      router.refresh();
    } else {
      setError('Incorrect code');
    }
  }

  return (
    <div className='flex min-h-[80vh] items-center justify-center'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle>Enter Passcode</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className='space-y-3'>
            <Input
              type='password'
              inputMode='numeric'
              pattern='[0-9]*'
              placeholder='••••'
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
            />
            {error && (
              <p className='text-sm text-destructive' role='alert'>
                {error}
              </p>
            )}
            <Button type='submit' className='w-full'>
              Unlock
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
