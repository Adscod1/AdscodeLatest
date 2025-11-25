'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Attempt to clear cookies using client-side JavaScript as an additional fallback
    const clearCookiesClientSide = () => {
      const cookies = document.cookie.split(';');
      
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        
        // Expire the cookie
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname};`;
      }
    };

    // Try to logout via API
    const performLogout = async () => {
      try {
        // First attempt: Use the API route
        const response = await fetch('/api/auth/logout');
        
        if (!response.ok) {
          console.warn('Logout API failed, trying client-side cookie clearing');
          setError('Logout API failed. Attempting alternative logout method...');
          
          // Second attempt: Clear cookies client-side
          clearCookiesClientSide();
        }
      } catch (e) {
        console.error('Logout error:', e);
        setError('Error during logout. Attempting alternative logout method...');
        
        // Fallback: Clear cookies client-side
        clearCookiesClientSide();
      }
    };

    performLogout();

    // Start countdown for redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/auth/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleManualLogout = () => {
    // Force clear localStorage and sessionStorage
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error('Error clearing storage:', e);
    }
    
    // Navigate to login
    router.push('/auth/login');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Logging Out</h1>
        
        {error ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded mb-4">
            {error}
          </div>
        ) : (
          <p className="text-gray-600 mb-4 text-center">
            You are being logged out...
          </p>
        )}
        
        <div className="text-center">
          <p className="text-sm text-gray-500 mt-4">
            Redirecting in {countdown} seconds...
          </p>
          <button 
            onClick={handleManualLogout}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
