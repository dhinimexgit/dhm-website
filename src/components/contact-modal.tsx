'use client';

import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Props = {
  productName: string;
  triggerText?: string;
  triggerClassName?: string;
  initialQuestion?: string;
};

export function ContactModal({ 
  productName, 
  triggerText = "Contact Us", 
  triggerClassName = "w-full sm:w-auto rounded-full bg-brand-navy px-8 py-4 text-center text-sm font-bold text-white shadow-lg transition hover:bg-[#252f6e]",
  initialQuestion = ""
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [phoneValue, setPhoneValue] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const inquiry = formData.get('inquiry') as string;

    // Ensure phone number has +855 prefix (phoneValue is already numeric-only)
    let phone = phoneValue.trim();
    if (!phone.startsWith('+855')) {
      // Remove any existing + or leading zeros
      phone = phone.replace(/^\+?0*/, '');
      phone = `+855${phone}`;
    }

    try {
      await addDoc(collection(db, 'inquiries'), {
        name,
        phone,
        message: `Product Inquiry for: ${productName}\n\n${inquiry}`,
        createdAt: serverTimestamp(),
        status: 'new',
        type: 'product_inquiry',
        productName
      });
      setSuccess(true);
      setPhoneValue(''); // Reset phone input
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setPhoneValue(''); // Reset phone input when opening modal
          setError('');
        }}
        className={triggerClassName}
      >
        {triggerText}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-brand-navy">Product Inquiry</h3>
          <button
            onClick={() => {
              setIsOpen(false);
              setPhoneValue('');
              setError('');
            }}
            className="text-slate-400 hover:text-slate-600"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="rounded-xl bg-green-50 p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="mb-2 font-semibold text-green-900">Message Sent!</h4>
            <p className="text-sm text-green-700">We'll get back to you shortly regarding {productName}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Product</label>
              <input
                type="text"
                value={productName}
                disabled
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-slate-500"
              />
            </div>

            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                placeholder="Bopha Vatey"
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
                Phone Number *
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-slate-500">+855</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={phoneValue}
                  onChange={(e) => {
                    // Only allow numbers
                    const numericValue = e.target.value.replace(/[^0-9]/g, '');
                    setPhoneValue(numericValue);
                  }}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  className="w-full rounded-lg border border-slate-200 pl-16 pr-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                  placeholder="12 345 6789"
                />
              </div>
            </div>

            <div>
              <label htmlFor="inquiry" className="mb-1 block text-sm font-medium text-slate-700">
                Your Question *
              </label>
              <textarea
                name="inquiry"
                id="inquiry"
                required
                rows={3}
                defaultValue={initialQuestion}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                placeholder="I would like to know more about..."
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand-navy py-3 font-semibold text-white transition hover:bg-[#252f6e] disabled:opacity-70"
            >
              {loading ? 'Sending...' : 'Send Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

