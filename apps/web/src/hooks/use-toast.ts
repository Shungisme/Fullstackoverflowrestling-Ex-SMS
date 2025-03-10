import { useEffect, useState } from "react";

const TOAST_LIMIT = 3;
const TOAST_REMOVE_DELAY = 1000;

export type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  open: boolean;
  variant?: "default" | "destructive";
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function generateId() {
  return `${Date.now()}-${++count}`;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  function toast({
    title,
    description,
    variant,
    ...props
  }: Omit<ToastProps, "id" | "open">) {
    const id = generateId();

    setToasts((toasts) => {
      if (toasts.length >= TOAST_LIMIT) {
        toasts.shift();
      }

      return [
        ...toasts,
        { id, title, description, variant, open: true, ...props },
      ];
    });

    return {
      id,
      dismiss: () => dismissToast(id),
      update: (props: Omit<ToastProps, "id" | "open">) =>
        updateToast(id, props),
    };
  }

  function dismissToast(id: string) {
    setToasts((toasts) =>
      toasts.map((toast) =>
        toast.id === id ? { ...toast, open: false } : toast
      )
    );

    setTimeout(() => {
      setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
    }, TOAST_REMOVE_DELAY);
  }

  function updateToast(id: string, props: Omit<ToastProps, "id" | "open">) {
    setToasts((toasts) =>
      toasts.map((toast) => (toast.id === id ? { ...toast, ...props } : toast))
    );
  }

  return {
    toast,
    toasts,
    dismissToast,
  };
}
