'use client';

import { useState, useEffect } from 'react';
import { 
  generateNewQRCode, 
  getQRCodeHistory, 
  getActiveQRCode,
  verifySecurityHash,
  resetAndGenerateQRCode,
  type QRCodeHistory 
} from '@/lib/qrcode';

interface QRCodeManagerProps {
  userEmail: string;
}

export function QRCodeManager({ userEmail }: QRCodeManagerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [currentQR, setCurrentQR] = useState<{ dataUrl: string; history: QRCodeHistory } | null>(null);
  const [history, setHistory] = useState<QRCodeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSecurityInfo, setShowSecurityInfo] = useState(false);

  // Load history and current QR on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [historyData, activeQR] = await Promise.all([
        getQRCodeHistory(),
        getActiveQRCode()
      ]);
      
      setHistory(historyData);
      
      if (activeQR) {
        setCurrentQR({
          dataUrl: activeQR.storageUrl,
          history: activeQR
        });
      }
    } catch (err) {
      console.error('Failed to load QR data:', err);
      setError('Failed to load QR code data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const result = await generateNewQRCode(userEmail);
      setCurrentQR({
        dataUrl: result.qrCodeDataUrl,
        history: result.history
      });
      
      // Reload history
      const historyData = await getQRCodeHistory();
      setHistory(historyData);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
      setError('Failed to generate QR code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    setError(null);
    setShowResetConfirm(false);
    
    try {
      const result = await resetAndGenerateQRCode(userEmail);
      setCurrentQR({
        dataUrl: result.qrCodeDataUrl,
        history: result.history
      });
      
      // Reload history (will only have v1)
      const historyData = await getQRCodeHistory();
      setHistory(historyData);
    } catch (err) {
      console.error('Failed to reset QR codes:', err);
      setError('Failed to reset QR codes. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleDownload = () => {
    if (!currentQR) return;
    
    const link = document.createElement('a');
    link.href = currentQR.dataUrl;
    link.download = `dhm-msrp-qr-v${currentQR.history.version}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-brand-navy border-r-transparent"></div>
          <p className="mt-4 text-slate-600">Loading QR code data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-red">
            Security
          </p>
          <h1 className="text-4xl font-semibold text-brand-navy">
            QR Code Generator
          </h1>
          <p className="max-w-2xl text-lg text-slate-600">
            Generate secure, encrypted QR codes for MSRP verification. Each code is uniquely encoded and versioned.
          </p>
        </div>
        <div className="flex gap-3">
          {/* <button
            onClick={() => setShowResetConfirm(true)}
            disabled={isResetting || isGenerating}
            className="rounded-full border-2 border-red-500 bg-white px-5 py-3 text-sm font-semibold text-red-500 shadow-lg transition hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResetting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Resetting...
              </span>
            ) : (
              '⟲ Reset to v1'
            )}
          </button> */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || isResetting}
            className="rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-navy/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </span>
            ) : (
              '+ Generate New QR Code'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Reset All QR Codes?</h3>
            <p className="mt-2 text-sm text-slate-600">
              This will <strong>permanently delete</strong> all QR code history and images from the database. 
              A new v1 QR code will be generated. This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Current QR Code Section */}
      <div className="grid gap-2">
        {/* QR Code Display */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-brand-navy">
            Current Active QR Code
          </h2>
          
          {currentQR ? (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative rounded-xl border-2 border-slate-100 bg-white p-4 shadow-inner">
                  <img
                    src={currentQR.dataUrl}
                    alt="MSRP QR Code"
                    className="h-64 w-64 object-contain"
                  />
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white shadow">
                    Active • v{currentQR.history.version}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 rounded-lg bg-slate-50 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Version</span>
                  <span className="font-mono font-semibold text-slate-700">v{currentQR.history.version}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Generated By</span>
                  <span className="font-medium text-slate-700">{currentQR.history.generatedBy}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Generated At</span>
                  <span className="text-slate-700">{formatDate(currentQR.history.generatedAt)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDownload}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  ↓ Download PNG
                </button>
                <button
                  onClick={() => setShowSecurityInfo(!showSecurityInfo)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {showSecurityInfo ? 'Hide' : 'Show'} Security Info
                </button>
              </div>

              {showSecurityInfo && (
                <div className="space-y-3">
                  <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-2">
                      QR Code Content (What phones will see)
                    </p>
                    <p className="font-mono text-xl font-bold text-green-800">
                      {currentQR.history.qrContent}
                    </p>
                  </div>
                  
                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Security Hash (Unique ID)</p>
                    <code className="block break-all text-xs text-green-400 font-mono">
                      {currentQR.history.securityHash}
                    </code>
                  </div>
                  
                  <div className="rounded-lg bg-slate-800 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Session Salt</p>
                    <code className="block break-all text-xs text-amber-400 font-mono">
                      {currentQR.history.sessionSalt}
                    </code>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-slate-100 p-6">
                <svg className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-700">No QR Code Generated Yet</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-xs">
                Click "Generate New QR Code" to create your first encrypted MSRP QR code.
              </p>
            </div>
          )}
        </div>

        {/* How It Works Section */}
        {/* <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold text-brand-navy">
            How It Works
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
                1
              </div>
              <div>
                <h3 className="font-semibold text-slate-700">Unique Visual Pattern</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Each version uses different QR parameters (error correction + mask pattern) creating a <strong>unique visual pattern</strong>.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
                2
              </div>
              <div>
                <h3 className="font-semibold text-slate-700">Clean Scan Result</h3>
                <p className="mt-1 text-sm text-slate-500">
                  All versions scan to: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-brand-navy font-mono text-xs">Dhm-msrp-2003</code>
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
                3
              </div>
              <div>
                <h3 className="font-semibold text-slate-700">32 Unique Variations</h3>
                <p className="mt-1 text-sm text-slate-500">
                  4 error levels × 8 mask patterns = 32 distinct QR patterns before repeating.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
                4
              </div>
              <div>
                <h3 className="font-semibold text-slate-700">Full Audit Trail</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Tracks who generated each QR, when, with security hash stored in Firebase.
                </p>
              </div>
            </div>
          </div>

          {/* <div className="mt-8 rounded-lg bg-green-50 p-4 border border-green-200">
            <p className="text-sm text-green-800">
              <span className="font-semibold">✓ Result:</span> Each QR looks different but all scan to 
              <strong> "Dhm-msrp-2003"</strong> — no extra characters!
            </p>
          </div> 
        </div> */}
      </div>

      {/* History Section */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-brand-navy">
          Version History
        </h2>
        
        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Version</th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Generated By</th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Generated At</th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-4">
                      <span className="font-mono font-semibold text-slate-700">v{item.version}</span>
                    </td>
                    <td className="py-4">
                      {item.isActive ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                          Archived
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-sm text-slate-600">{item.generatedBy}</td>
                    <td className="py-4 text-sm text-slate-600">{formatDate(item.generatedAt)}</td>
                    <td className="py-4">
                      <a
                        href={item.storageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-brand-navy hover:text-brand-red transition"
                      >
                        View →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p>No QR codes have been generated yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

