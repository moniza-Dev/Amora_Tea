/** Re-mounts on every navigation, so each page fades/slides in. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page">{children}</div>;
}
