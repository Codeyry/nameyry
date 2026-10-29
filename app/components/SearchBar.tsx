"use client";

import SearchIcon from "@/components/icons/SearchIcon";
import { getSearchResult } from "@/app/actions";
import { useState } from "react";

type NameItem = {
  id: number;
  nickname: string;
  publisher: string;
  likes: number;
  created_at: string;
  status: string;
};

export default function SearchBar({
  onResults,
  onClear
}: {
  onResults: (items: NameItem[]) => void;
  onClear: () => void;
}) {
  const [input, setInput] = useState("");
  const [hasSearched, setHasSearched] = useState(false);


  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInput(value);

    if (value === "" && hasSearched) {
      setHasSearched(false);
      onClear();
    }
  }   

  async function handleSearch() {
    if (!input.trim()) return;
    const results = await getSearchResult(input.trim());
    onResults(results ?? []);
    setHasSearched(true);
  }

  return (
    <section className="mx-auto flex w-[calc(100%-2.5rem)] max-w-2xl items-center gap-3 rounded-xl border border-border bg-card/90 p-2 shadow-[0_20px_80px_-30px_rgba(0,0,0,0.35)] ring-1 ring-foreground/5 sm:w-full">
      <input
        className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0 sm:text-base"
        type="search"
        name="search"
        value={input}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        id="srch"
        placeholder="Try a word, mood, or interest..."
      />


      <button
        type="button"
        onClick={handleSearch}
        className="flex shrink-0 items-center gap-2 rounded-sm
                            bg-primary px-4 py-3 font-bold text-primary-foreground
                            transition-colors duration-200
                            hover:brightness-105
                            active:scale-[0.98]
                            focus-visible:outline-2
                            focus-visible:outline-offset-2
                            focus-visible:outline-accent
                            cursor-pointer"
      >
      <SearchIcon className="h-4 w-4 text-primary-foreground" />
      <span>Explore</span>
    </button>

      
    </section>
  );
}
