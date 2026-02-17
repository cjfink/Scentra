"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export type SearchResult = { id: string; name: string; brand: string; thumbnailUrl: string | null };

export function Typeahead({ onSelect }: { onSelect: (item: SearchResult) => void }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchResult[]>([]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query) return setItems([]);
      const res = await fetch(`/api/fragrances/search?q=${encodeURIComponent(query)}&limit=10`);
      setItems(await res.json());
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search fragrance name or brand" className="pl-9" />
      </div>
      {items.length > 0 && (
        <div className="max-h-72 space-y-2 overflow-auto rounded-md border p-2">
          {items.map((item) => (
            <button key={item.id} onClick={() => onSelect(item)} className="flex w-full items-center gap-3 rounded p-2 text-left hover:bg-muted">
              <Image src={item.thumbnailUrl ?? "https://picsum.photos/seed/fallback/80/80"} alt={item.name} width={40} height={40} className="rounded" />
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">{item.brand}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
