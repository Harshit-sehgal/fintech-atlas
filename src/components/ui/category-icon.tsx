const icons: Record<string, string> = {
  card: `<rect x="6" y="12" width="28" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 18h28" stroke="currentColor" stroke-width="2"/><rect x="12" y="22" width="16" height="4" rx="1" fill="currentColor"/>`,
  bank: `<rect x="8" y="14" width="24" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 14l14-8l14 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`,
  chart: `<path d="M6 34V28l8-8l6 4l6-14l8 10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
  globe: `<circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cx="20" cy="20" rx="7" ry="14" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 20h28" stroke="currentColor" stroke-width="1.5"/>`,
  tag: `<path d="M6 10l12-6l20 18l-12 6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="20" cy="16" r="2.5" fill="currentColor"/>`,
  api: `<path d="M8 20h24M20 8v24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="20" cy="20" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="32" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="8" cy="32" r="3" fill="none" stroke="currentColor" stroke-width="1.5"/>`,
};

export function CategoryIcon({ icon, size = 40, color }: { icon: string; size?: number; color?: string }) {
  const svg = icons[icon];
  if (!svg) return null;
  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg surface ${color ? '' : 'border'}`}
      style={{ width: size, height: size, backgroundColor: color ? `${color}10` : undefined, color: color }}
      dangerouslySetInnerHTML={{
        __html: `<svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">${svg}</svg>`,
      }}
    />
  );
}