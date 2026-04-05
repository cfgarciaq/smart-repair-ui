import * as React from "react";

export type ToastData = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  // allow other props used by Toast primitives
  [key: string]: unknown;
};

export function useToast() {
  // Minimal placeholder hook to satisfy Toaster component types.
  // In the real app this should manage adding/removing toasts.
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const add = (toast: ToastData) => {
    setToasts((prev) => [...prev, toast]);
  };

  const remove = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast: add, removeToast: remove };
}
