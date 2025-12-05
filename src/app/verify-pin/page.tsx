'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CORRECT_PIN = '2003';

export default function VerifyPinPage() {
  const [pin, setPin] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);
      
      // Auto-verify when 4 digits entered
      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          setIsVerified(true);
        } else {
          setError(true);
          setShake(true);
          setTimeout(() => {
            setShake(false);
            setPin('');
          }, 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isVerified) return;
      
      if (e.key >= '0' && e.key <= '9') {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isVerified]);

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-6 text-center">
              <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white">Verified ✓</h1>
              <p className="text-emerald-100 mt-1 text-sm">Authentic Dhinimex Product</p>
            </div>
            
            {/* Content */}
            <div className="p-8 text-center">
              <div className="mb-6">
                <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">Product Code</p>
                <div className="bg-slate-100 rounded-2xl py-6 px-4">
                  <p className="text-3xl font-bold text-slate-800 tracking-wider font-mono">
                    Dhm-msrp-2003
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 text-left bg-emerald-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-emerald-800">Genuine Dhinimex Product</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-emerald-800">MSRP Verified</span>
                </div>
              </div>

              <Link 
                href="/"
                className="inline-flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-brand-navy transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Visit Dhinimex Website
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400 mt-6">
            © {new Date().getFullYear()} Dhinimex Co., Ltd.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2E388C] to-[#3d4a9e] px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl mx-auto flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">Product Verification</h1>
            <p className="text-blue-200 text-sm mt-1">Enter 4-digit PIN to verify</p>
          </div>

          {/* PIN Display */}
          <div className="px-8 pt-8 pb-4">
            <div 
              className={`flex justify-center gap-4 mb-2 ${shake ? 'animate-shake' : ''}`}
            >
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all duration-200 ${
                    pin.length > index
                      ? error 
                        ? 'border-red-400 bg-red-50 text-red-600'
                        : 'border-brand-navy bg-blue-50 text-brand-navy'
                      : 'border-slate-200 bg-slate-50 text-slate-300'
                  }`}
                >
                  {pin.length > index ? '●' : '○'}
                </div>
              ))}
            </div>
            
            {error && (
              <p className="text-center text-red-500 text-sm mt-2 animate-pulse">
                Incorrect PIN. Please try again.
              </p>
            )}
          </div>

          {/* Keypad */}
          <div className="px-8 pb-8">
            <div className="grid grid-cols-3 gap-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === 'C') handleClear();
                    else if (key === '⌫') handleDelete();
                    else handleKeyPress(key);
                  }}
                  className={`h-16 rounded-xl text-2xl font-semibold transition-all duration-150 active:scale-95 ${
                    key === 'C'
                      ? 'bg-slate-100 text-slate-500 hover:bg-slate-200 text-base'
                      : key === '⌫'
                      ? 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      : 'bg-slate-50 text-slate-700 hover:bg-blue-50 hover:text-brand-navy border border-slate-200'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-400">
            Scan official Dhinimex QR codes to verify products
          </p>
          <p className="text-xs text-slate-400 mt-1">
            © {new Date().getFullYear()} Dhinimex Co., Ltd.
          </p>
        </div>
      </div>

      {/* Shake Animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}

