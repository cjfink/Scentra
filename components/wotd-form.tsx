"use client";

import { useState } from "react";
import { Typeahead, SearchResult } from "@/components/typeahead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WotdForm() {
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [caption, setCaption] = useState("");

  async function submit() {
    if (!selected) return;
    await fetch("/api/wotd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fragranceId: selected.id, caption, occasion: "CASUAL" })
    });
    window.location.reload();
  }

  return (
    <div className="space-y-3 rounded-xl border p-5">
      <h2 className="text-lg font-semibold">Post Wearing Today</h2>
      <Typeahead onSelect={setSelected} />
      <Input placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
      <Button onClick={submit}>Post WOTD</Button>
    </div>
  );
}
