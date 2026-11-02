"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export interface ClientUser { name: string | null; email: string; role: "customer" | "shop" }

/** undefined = still checking, null = signed out. Re-checks on every navigation so login/logout show instantly. */
export function useSession() {
  const pathname = usePathname();
  const [user, setUser] = useState<ClientUser | null | undefined>(undefined);
  useEffect(() => {
    const ctl = new AbortController();
    fetch("/api/me", { cache: "no-store", signal: ctl.signal })
      .then((r) => r.json())
      .then((d) => setUser(d.user ?? null))
      .catch(() => {});
    return () => ctl.abort();
  }, [pathname]);
  return user;
}
