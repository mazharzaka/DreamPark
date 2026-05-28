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
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://smfxhlj1-5000.euw.devtunnels.ms/';
        const base = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
        const response = await fetch(`${base}/api/auth/refresh`, {
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
