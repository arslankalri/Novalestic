import React from 'react';
import { useShop } from '../context/ShopContext';
import { CheckCircle2 } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { toastMessage } = useShop();

  if (!toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 bg-[#1b1c19] text-white px-6 py-4 shadow-2xl transition-all duration-300 flex items-center gap-3 border border-[#DFC27F]/40 animate-in slide-in-from-bottom-5"
    >
      <CheckCircle2 className="w-5 h-5 text-[#DFC27F] shrink-0" />
      <span className="text-xs sm:text-sm tracking-wide font-normal font-sans">
        {toastMessage}
      </span>
    </div>
  );
};
