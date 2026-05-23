import { useEffect, useRef } from 'react';
import { setCredentials } from '@/src/lib/features/auth/authSlice';
import { useAppDispatch } from '@/src/lib/hooks';

export const useSessionRestore = () => {
  const dispatch = useAppDispatch();
  const hasAttemptedRestore = useRef(false);

  useEffect(() => {
    if (hasAttemptedRestore.current) return;
    hasAttemptedRestore.current = true;

    const restoreSession = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/refresh`, {
          method: 'POST',
          // Important: Next.js + Fetch requires credentials: 'include' to send the httpOnly cookie
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.token) {
            dispatch(setCredentials({ token: data.token, user: data.data.user }));
          }
        }
      } catch (error) {
        // Silently fail on network error or no active session
      }
    };

    restoreSession();
  }, [dispatch]);
};
