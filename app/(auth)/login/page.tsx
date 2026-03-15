// app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // SÄKERHETSÅTGÄRD: State för TOTP-verifiering
  const [totpToken, setTotpToken] = useState('');
  const [requiresTOTP, setRequiresTOTP] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // SÄKERHETSÅTGÄRD: Skicka TOTP-token om det krävs
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          ...(requiresTOTP && { totpToken }) // Inkludera TOTP-token om det behövs
        }),
      });

      const data = await res.json();

      // SÄKERHETSÅTGÄRD: Hantera TOTP-krav
      if (data.requiresTOTP && !requiresTOTP) {
        setRequiresTOTP(true);
        setPassword(''); // Rensa lösenordet från state av säkerhetsskäl
        return;
      }

      if (res.ok) {
        router.push('/admin');
      } else {
        setError(data.error || 'Felaktiga inloggningsuppgifter');
      }
    } catch (err) {
      setError('Nätverksfel');
    }
  };

  return (
    <div className="h-screen max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">
        {requiresTOTP ? '2FA-verifiering' : 'Logga in'}
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        {!requiresTOTP ? (
          <>
            <input
              type="email"
              placeholder="E-post"
              className="w-full p-2 mb-4 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Lösenord"
              className="w-full p-2 mb-4 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        ) : (
          // SÄKERHETSÅTGÄRD: TOTP-inmatning för 2FA
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Ange den 6-siffriga koden från din autentiseringsapp
            </p>
            <input
              type="text"
              placeholder="000000"
              className="w-full p-2 mb-4 border rounded text-center tracking-widest text-2xl"
              value={totpToken}
              onChange={(e) => setTotpToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {requiresTOTP ? 'Verifiera' : 'Logga in'}
        </button>
      </form>
    </div>
  );
}
