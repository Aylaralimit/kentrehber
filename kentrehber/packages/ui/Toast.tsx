'use client';
import { Toaster, toast } from 'sonner';
export { toast };
export function Toast() {
  return (
    <Toaster
      containerAriaLabel="Bildirimler"
      closeButton
      position="bottom-right"
      toastOptions={{
        closeButtonAriaLabel: 'Kapat',
        style: {
          background: 'var(--theme-elevated)',
          color: 'var(--theme-text)',
          borderColor: 'var(--theme-border)',
          borderRadius: 'var(--theme-radius)',
          fontFamily: 'var(--theme-font-body)',
        },
      }}
    />
  );
}
