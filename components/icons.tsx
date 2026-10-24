type SvgProps = {
  size?: number;
  className?: string;
};

export function DownloadIcon({ size = 16, className }: SvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 3v12m0 0l-5-5m5 5l5-5M5 21h14" />
    </svg>
  );
}

export function GitHubIcon({ size = 16, className }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2 1-.3 2-.4 3-.4 1 0 2 .1 3 .4 2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.7.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
    </svg>
  );
}

export function ArrowRight({ size = 14, className }: SvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

export function AppleIcon({ size = 14 }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.4 12.8c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.1-2.7.9-3.4.9-.7 0-1.8-.9-3-.9-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.8 3.1-.8s1.9.7 3.1.7c1.3 0 2.1-1.1 2.9-2.2.9-1.3 1.3-2.6 1.3-2.7-.1 0-2.6-1-2.9-3.3zM14.3 5.5c.7-.8 1.1-1.9 1-3-1 .1-2.1.7-2.8 1.5-.6.7-1.1 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z" />
    </svg>
  );
}

export function WindowsIcon({ size = 14 }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 5.6l7.4-1v7.2H3V5.6zM11.6 4.4L21 3v8.8h-9.4V4.4zM3 12.9h7.4V20L3 19V12.9zM11.6 12.9H21V21l-9.4-1.3v-6.8z" />
    </svg>
  );
}

export function LinuxIcon({ size = 14 }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c-2 0-3.1 1.7-3.1 3.9 0 1.4.1 2.3-.5 3.4-.9 1.6-2.3 3-2.6 4.9-.3 1.8.6 3.4 2 4.3-.5.5-.8 1-.8 1.6 0 1.1 1.1 1.9 2.6 1.9.9 0 1.7-.3 2.4-.3s1.5.3 2.4.3c1.5 0 2.6-.8 2.6-1.9 0-.6-.3-1.1-.8-1.6 1.4-.9 2.3-2.5 2-4.3-.3-1.9-1.7-3.3-2.6-4.9-.6-1.1-.5-2-.5-3.4C15.1 3.7 14 2 12 2zm-1.3 3.2c.4 0 .7.4.7.9s-.3.9-.7.9-.7-.4-.7-.9.3-.9.7-.9zm2.6 0c.4 0 .7.4.7.9s-.3.9-.7.9-.7-.4-.7-.9.3-.9.7-.9zM12 8.1c.9 0 1.9.5 1.9 1 0 .6-1 1.3-1.9 1.3s-1.9-.7-1.9-1.3c0-.5 1-1 1.9-1z" />
    </svg>
  );
}

export function AndroidIcon({ size = 14 }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 9h12a1 1 0 011 1v7a2 2 0 01-2 2h-1v3h-2v-3h-3v3H9v-3H7a2 2 0 01-2-2v-7a1 1 0 011-1zm-2.5.5a1.5 1.5 0 013 0v6a1.5 1.5 0 01-3 0v-6zm14 0a1.5 1.5 0 013 0v6a1.5 1.5 0 01-3 0v-6zM8.2 7.2l-1-1.7a.4.4 0 01.7-.4l1 1.8a6.9 6.9 0 016.2 0l1-1.8a.4.4 0 01.7.4l-1 1.7A6.6 6.6 0 0118 8.6H6a6.6 6.6 0 012.2-1.4zM9.3 5.9a.6.6 0 100 1.2.6.6 0 000-1.2zm5.4 0a.6.6 0 100 1.2.6.6 0 000-1.2z" />
    </svg>
  );
}

export function HarmonyIcon({ size = 14 }: SvgProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M4 15c2.2-4.6 4.4-6.9 8-6.9 3.4 0 5.6 2.1 8 6.9" />
      <path d="M7.4 18.2c1.3-2.4 2.7-3.6 4.6-3.6s3.3 1.2 4.6 3.6" />
      <circle cx="12" cy="5.2" r="1.6" />
    </svg>
  );
}

export function CheckIcon({ size = 14 }: SvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}
