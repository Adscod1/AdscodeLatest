'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetButton() {
  const [isResetting, setIsResetting] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset your influencer account? This will delete all your influencer data.')) {
      return;
    }
    
    setIsResetting(true);
    
    try {
      const response = await fetch('/api/influencer/reset', {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Your influencer account has been reset. You will be redirected to the landing page.');
        router.push('/influencer/landingpage');
      } else {
        alert(data.error || 'Failed to reset account');
      }
    } catch (error) {
      console.error('Error resetting account:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };
  
  return (
    <button
      onClick={handleReset}
      disabled={isResetting}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
    >
      {isResetting ? 'Resetting...' : 'Reset Influencer Account'}
    </button>
  );
}
