"use client";

import { useEffect, useMemo, useState } from "react";

export interface DeliveryPin {
  /** Link the driver can open in Google Maps. Put this in the Telegram / order message. */
  mapsUrl: string;
  /** Set only when the customer shared their phone location (exact pin). */
  coords: { lat: number; lng: number } | null;
}

interface Props {
  /** Text from the "Delivery Location" box. The map follows it as the customer types. */
  address: string;
  /** Called whenever the pin changes. null = nothing to deliver to yet. */
  onPinChange?: (pin: DeliveryPin | null) => void;
  className?: string;
}

const CITY = "Phnom Penh, Cambodia";
const MIN_CHARS = 4;

export function DeliveryMap({ address, onPinChange, className = "" }: Props) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<"idle" | "locating" | "denied" | "unavailable">("idle");
  const [typed, setTyped] = useState("");

  // Wait for the customer to stop typing before moving the map.
  useEffect(() => {
    const t = setTimeout(() => setTyped(address.trim()), 600);
    return () => clearTimeout(t);
  }, [address]);

  const query = useMemo(() => {
    if (typed.length < MIN_CHARS) return "";
    return /phnom\s*penh/i.test(typed) ? typed : `${typed}, ${CITY}`;
  }, [typed]);

  const q = coords ? `${coords.lat},${coords.lng}` : query || CITY;
  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=${coords ? 17 : query ? 16 : 12}&output=embed`;
  const mapsUrl = coords
    ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || CITY)}`;
  const hasPin = !!coords || !!query;

  useEffect(() => {
    onPinChange?.(hasPin ? { mapsUrl, coords } : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasPin, mapsUrl, coords?.lat, coords?.lng]);

  function shareLocation() {
    if (!("geolocation" in navigator)) return setStatus("unavailable");
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: +pos.coords.latitude.toFixed(6), lng: +pos.coords.longitude.toFixed(6) });
        setStatus("idle");
      },
      (err) => setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "unavailable"),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    );
  }

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-card border border-forest/15 bg-sand/60">
        <iframe
          key={embedSrc}
          title="Delivery location on Google Maps"
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="block h-56 w-full border-0"
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={shareLocation}
          disabled={status === "locating"}
          className="btn-press inline-flex items-center gap-1.5 rounded-full bg-forest px-4 py-2 text-xs font-medium text-white hover:bg-forest-dark disabled:opacity-60"
        >
          <span aria-hidden>📍</span>
          {status === "locating" ? "Finding you…" : coords ? "Update my location" : "Use my current location"}
        </button>
        {hasPin && (
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="rounded-full border border-forest/25 px-4 py-2 text-xs font-medium text-forest hover:bg-leaf-soft">
            Open in Google Maps
          </a>
        )}
        {coords && (
          <button type="button" onClick={() => setCoords(null)} className="px-2 py-2 text-xs text-ink-soft underline underline-offset-2 hover:text-forest">
            Use typed address instead
          </button>
        )}
      </div>

      <p className="mt-2 text-xs text-ink-soft" role="status">
        {status === "denied" && "Location is blocked in your browser. Allow it for this site, or type your address above."}
        {status === "unavailable" && "We couldn't get your location. Please type your address above."}
        {status === "idle" && coords && "Exact pin saved. Our driver will receive this location."}
        {status === "idle" && !coords && query && "Check the pin is right. If not, add a street number or landmark, or use your current location."}
        {status === "idle" && !coords && !query && "Type your address or share your location. A pin helps our driver find you faster."}
      </p>
    </div>
  );
}
