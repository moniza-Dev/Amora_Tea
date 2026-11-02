import { useSyncExternalStore } from "react";

/** false during SSR/hydration, true afterwards. Avoids mismatches for localStorage-backed state. */
export const useMounted = () => useSyncExternalStore(() => () => {}, () => true, () => false);
