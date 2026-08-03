"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Toast {
  id: string;
  message: string;
  type?: "success" | "info" | "error";
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "info" | "error") => void;
}

// Undefined so components rendered outside the provider fail loudly instead of
// silently no-op'ing (see useToast below).
const ToastContext = createContext<ToastContextType | undefined>(undefined);

const DEFAULT_DURATION_MS = 4000;
const ERROR_DURATION_MS = 6500;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: "success" | "info" | "error" = "success") => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              durationMins={
                toast.type === "error" ? ERROR_DURATION_MS : DEFAULT_DURATION_MS
              }
              onDismiss={() => dismiss(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  durationMins,
  onDismiss,
}: {
  toast: Toast;
  durationMins: number;
  onDismiss: () => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const schedule = useCallback(
    (delay: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(onDismiss, delay);
    },
    [onDismiss],
  );

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    schedule(durationMins);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, durationMins, schedule]);

  // Errors are announced assertively; informational/success politely.
  const isError = toast.type === "error";
  const liveProps = isError
    ? { role: "alert" as const, "aria-live": "assertive" as const }
    : { role: "status" as const, "aria-live": "polite" as const };

  return (
    <motion.div
      {...liveProps}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
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
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="ml-1 rounded p-1 text-current opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-[var(--ring)]"
      >
        ✕
      </button>
    </motion.div>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside a ToastProvider");
  }
  return context;
}
