"use client";

import { useState } from "react";

type Location = {
  latitude: number;
  longitude: number;
};

export default function LocationFinder() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async(position) => {
        const loc = { latitude: position.coords.latitude,
          longitude: position.coords.longitude,}
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
        
try {
  const res = await fetch("/api/location", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loc),
  });

  const data = await res.json();
  console.log("Saved to Supabase:", data);
} catch (err) {
  console.error("Error sending location to API:", err);
}

      },
      (err) => {
        setError(err.message);
        setLocation(null);
      }
    );
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleLocationClick}
        className="rounded bg-black px-4 py-2 text-white"
      >
        Get My Location
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {location && (
    <iframe
      width="100%"
      height="400"
      className="rounded border"
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
      />
      )}
    </div>
  );
}
