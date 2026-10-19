import React from "react";
import { useShop } from "../context/ShopContext";
import { CheckCircle2 } from "lucide-react";

export const NotificationToast: React.FC = () => {
  const { toastMessage } = useShop();

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      {toastMessage && (
        <div className="flex items-center gap-3 rounded-full bg-primary/95 text-primary-foreground backdrop-blur-xl px-5 py-3 shadow-lift animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-champagne-soft shrink-0" aria-hidden="true" />
          <span className="text-sm">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
