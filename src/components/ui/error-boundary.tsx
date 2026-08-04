"use client";

import React, { Component, ReactNode } from "react";
import Link from "next/link";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React error boundary component that catches JavaScript errors anywhere in
 * its child component tree, logs those errors, and displays a fallback UI
 * instead of the component tree that threw.
 *
 * By default, it shows a simple error message. Pass a custom `fallback`
 * component to render something more tailored to your UI.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI.
    console.error("ErrorBoundary caught an error:", error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service here
    console.error("Uncaught error:", error, errorInfo);
  }

  public resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback ?? DefaultFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

/** Default fallback UI shown when an error is caught. */
function DefaultFallback({
  error,
  resetError,
}: {
  error: Error;
  resetError: () => void;
}) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[var(--background)]/90 backdrop-blur-sm z-50"
    >
      <div role="alert" className="bg-[var(--card)] rounded-xl p-8 w-full max-w-2xl text-center border border-[var(--border-color)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]/20 mb-4">
          <svg
            className="h-6 w-6 text-[var(--accent)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">
          Something went wrong
        </h2>

        <p className="mb-6 text-[var(--muted-text)]">
          We encountered an unexpected error. Please try refreshing the page.
          If the problem persists, let us know.
        </p>

        {/* Show error details in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 text-left text-[var(--muted-text)] text-sm">
            <p className="font-mono mb-2">{error.message}</p>
            {error.stack && (
              <pre className="bg-[var(--muted-bg)] p-2 rounded overflow-auto">
                {error.stack}
              </pre>
            )}
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={resetError}
            className="btn-primary"
            aria-label="Retry recovering from this error"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="btn-ghost ml-4"
            aria-label="Reload the page to recover from error"
          >
            Reload Page
          </button>
          <Link href="/" className="btn-ghost ml-4">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}