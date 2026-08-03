"use client";

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Toast {
  id: string;
  message: string;
  type?: "success" | "info" | "error";
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "info" | "error") => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      // Clean up any pending timers on unmount — prevents memory leaks and
      // stale setState calls after the provider is removed from the tree.
      for (const t of timers) clearTimeout(t);
      timers.clear();
    };
  }, []);

  const showToast = useCallback((message: string, type: "success" | "info" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    const timer = setTimeout(() => {
      timersRef.current.delete(timer);
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
    timersRef.current.add(timer);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none" role="status" aria-live="polite">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium shadow-xl backdrop-blur-md ${
                toast.type === "error"
                  ? "border-[var(--danger)]/30 bg-[var(--danger)]/10 text-[var(--foreground)]"
                  : toast.type === "info"
                  ? "border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--foreground)]"
                  : "border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--foreground)]"
              }`}
            >
              <span>
                {toast.type === "error" ? "❌" : toast.type === "info" ? "ℹ️" : "✨"}
              </span>
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
