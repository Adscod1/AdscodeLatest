'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutButton({ className }: { className?: string }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Navigate to our dedicated logout page that handles all logout scenarios
    router.push('/logout');
  };
  
  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className || "px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm"}
    >
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </button>
  );
}
