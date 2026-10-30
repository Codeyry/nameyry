"use client";

import { useState, useMemo, useCallback } from "react";
import SearchBar from "./SearchBar";
import NamesList from "./NamesList";

type NameItemType = {
  id: number;
  nickname: string;
  publisher: string;
  likes: number;
  created_at: string;
  status?: string;
};



export default function NamesSection({ initialNames }: { initialNames: NameItemType[] }) {
    const [names, setNames] = useState(initialNames)
    const [sort, setSort] = useState<"popular" | "recent">("popular");

    // Reset back to initial data
    const resetToInitial = useCallback(() => setNames(initialNames), [initialNames]);

  const sorted = useMemo(() => {
    return [...names].sort((a, b) =>
      sort === "recent"
        ? b.created_at.localeCompare(a.created_at)
        : b.likes - a.likes
    );
  }, [names, sort]);

  return (
    <>
      <SearchBar onResults={setNames} onClear={resetToInitial}/>
      <NamesList names={sorted} sort={sort} onSortChange={setSort} />
    </>
  );
}