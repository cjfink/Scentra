"use client";

import { useState } from "react";
import { Typeahead, SearchResult } from "@/components/typeahead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddCollectionForm() {
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [rating, setRating] = useState("8");
  const [wearCount, setWearCount] = useState("1");

  async function add() {
    if (!selected) return;
    await fetch("/api/collection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fragranceId: selected.id,
        rating: Number(rating),
        wearCount: Number(wearCount),
        wouldRepurchase: true,
        signature: false,
        seasonUse: ["spring", "summer"],
        occasionUse: ["office"]
      })
    });
    window.location.reload();
  }

  return (
    <div className="space-y-4">
      <Typeahead onSelect={setSelected} />
      {selected && (
        <div className="rounded-md border p-4">
          <p className="font-medium">Add details for {selected.name}</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Input value={rating} onChange={(e) => setRating(e.target.value)} type="number" min={1} max={10} placeholder="Rating" />
            <Input value={wearCount} onChange={(e) => setWearCount(e.target.value)} type="number" min={0} placeholder="Wear count" />
          </div>
          <Button onClick={add} className="mt-3">Add to collection</Button>
        </div>
      )}
    </div>
  );
}
