'use client';

import { useEffect, useState } from 'react';

type ModalType = 'success' | 'error' | 'info' | 'warning';

type CustomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  type: ModalType;
  title: string;
  message: string;
  details?: { label: string; value: string }[];
  actionLabel?: string;
  onAction?: () => void;
};

const modalConfig = {
  success: {
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    buttonBg: 'bg-green-600 hover:bg-green-700',
  },
  error: {
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    buttonBg: 'bg-red-600 hover:bg-red-700',
  },
  info: {
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    iconBg: 'bg-[#2E388C]/10',
    iconColor: 'text-[#2E388C]',
    buttonBg: 'bg-[#2E388C] hover:bg-[#3d4ba3]',
  },
  warning: {
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    iconBg: 'bg-[#D4A03C]/20',
    iconColor: 'text-[#D4A03C]',
    buttonBg: 'bg-[#D4A03C] hover:bg-[#b8892f]',
  },
};

export function CustomModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  details,
  actionLabel = 'OK',
  onAction,
}: CustomModalProps) {
  const config = modalConfig[type];

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAction = () => {
    if (onAction) {
      onAction();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform animate-slideUp">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6 text-center">
          {/* Icon */}
          <div className={`mx-auto w-16 h-16 rounded-full ${config.iconBg} ${config.iconColor} flex items-center justify-center mb-4`}>
            {config.icon}
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>

          {/* Message */}
          <p className="text-slate-600 mb-4">{message}</p>

          {/* Details */}
          {details && details.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 mb-4 text-left">
              <div className="space-y-2">
                {details.map((detail, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">{detail.label}:</span>
                    <span className="text-slate-700">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleAction}
            className={`w-full py-3 px-4 ${config.buttonBg} text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl`}
          >
            {actionLabel}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Hook for easier modal state management
export function useModal() {
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: ModalType;
    title: string;
    message: string;
    details?: { label: string; value: string }[];
    actionLabel?: string;
    onAction?: () => void;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showModal = (config: Omit<typeof modalState, 'isOpen'>) => {
    setModalState({ ...config, isOpen: true });
  };

  const hideModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const showSuccess = (title: string, message: string, onAction?: () => void) => {
    showModal({ type: 'success', title, message, onAction });
  };

  const showError = (title: string, message: string) => {
    showModal({ type: 'error', title, message });
  };

  const showInfo = (title: string, message: string, details?: { label: string; value: string }[]) => {
    showModal({ type: 'info', title, message, details });
  };

  const showWarning = (title: string, message: string) => {
    showModal({ type: 'warning', title, message });
  };

  return {
    modalState,
    showModal,
    hideModal,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
}

