'use client';

import { useState, useEffect } from 'react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      // Check if localStorage is available
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      
      const consent = localStorage.getItem('cookie-consent');
      if (!consent) {
        setIsVisible(true);
      }
    } catch (error) {
      console.error('LocalStorage access error:', error);
      setIsVisible(false);
    }
  }, []);

  const acceptCookies = () => {
    try {
      localStorage.setItem('cookie-consent', 'accepted');
      setIsVisible(false);
    } catch (error) {
      console.error('Failed to set cookie consent:', error);
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-600 mb-4 md:mb-0">
            We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          </p>
          <button
            onClick={acceptCookies}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
