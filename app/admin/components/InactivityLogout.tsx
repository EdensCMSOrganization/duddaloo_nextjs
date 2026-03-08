'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface InactivityLogoutProps {
  timeoutMinutes?: number;
}

export default function InactivityLogout({ timeoutMinutes = 60 }: InactivityLogoutProps) {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logoutUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/login?sessionExpired=true');
      } else {
        console.error('Utloggning misslyckades på grund av inaktivitet');
      }
    } catch (error) {
      console.error('Fel vid utloggning på grund av inaktivitet:', error);
    }
  }, [router]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(
      logoutUser,
      timeoutMinutes * 60 * 1000
    );
  }, [logoutUser, timeoutMinutes]);

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    resetTimer();

    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimer]);

  return null;
}
