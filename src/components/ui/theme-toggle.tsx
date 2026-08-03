import { useTheme } from "@/lib/theme-context";
import { ButtonHTMLAttributes } from "react";

type ThemeToggleProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
};

export function ThemeToggle({ className = "", ...props }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const SunIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );

  const MoonIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );

  const MonitorIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  );

  const getIcon = () => {
    switch (theme) {
      case "light": return <SunIcon />;
      case "dark": return <MoonIcon />;
      default: return <MonitorIcon />;
    }
  };

  const getLabel = () => {
    return `Theme: ${theme}`;
  };

  const handleClick = () => {
    setTheme((prev) => {
      if (prev === "system") return "light";
      if (prev === "light") return "dark";
      return "system";
    });
  };

  const baseClasses = "btn-icon";
  const combinedClassNames = className ? `${baseClasses} ${className}` : baseClasses;

  return (
    <button
      onClick={handleClick}
      className={combinedClassNames}
      aria-label={getLabel()}
      title={getLabel()}
      {...props}
    >
      {getIcon()}
    </button>
  );
}