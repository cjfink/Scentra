"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type CollectionOption = {
  fragrance: {
    id: string;
    name: string;
    brand: string;
  };
};

export function WotdForm({ options }: { options: CollectionOption[] }) {
  const [fragranceId, setFragranceId] = useState(
    options[0]?.fragrance.id ?? "",
  );
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setError(null);
    const res = await fetch("/api/wotd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fragranceId, caption }),
    });

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Could not create post");
      return;
    }

    window.location.href = "/feed";
  }

  return (
    <div className="space-y-4 rounded-xl border p-5">
      <h2 className="text-lg font-semibold">
        Post What I&apos;m Wearing Today
      </h2>
      {options.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Add fragrances to your collection before posting a WOTD.
        </p>
      ) : (
        <>
          <select
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            value={fragranceId}
            onChange={(event) => setFragranceId(event.target.value)}
          >
            {options.map((item) => (
              <option key={item.fragrance.id} value={item.fragrance.id}>
                {item.fragrance.name} — {item.fragrance.brand}
              </option>
            ))}
          </select>
          <Textarea
            placeholder="Short caption"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button onClick={submit}>Post WOTD</Button>
        </>
      )}
    </div>
  );
}
