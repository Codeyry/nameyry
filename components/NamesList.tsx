"use client";

// icons componenets
import CopyIcon from "@/components/icons/CopyIcon";
import CopyButton from "@/components/CopyButton";
import ListIcon from "./icons/ListIcon";
import { Sparkles } from "lucide-react";

type NameItemType = {
  id: number;
  nickname: string;
  publisher: string;
  likes: number;
  created_at: string;
};

type Props = {
  names: NameItemType[];
  sort: "popular" | "recent";
  onSortChange: (s: "popular" | "recent") => void;
};


export default function NamesList({ names, sort, onSortChange }: Props) {

  return (
    <div>
      <section className="mx-auto my-16 w-full max-w-7xl px-5 sm:px-8">
        <div className="mb-5 flex w-full items-end justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-primary">
              <ListIcon className="h-4 w-4" />
              <span>Community picks</span>
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Popular nicknames</h3>
          </div>
          {names.length > 0 && <div>
            <select
              name="names"
              id="names"
              className="rounded-sm border border-border bg-card px-3 py-2.5 text-sm font-semibold text-foreground outline-none transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring"
              value={sort}
              onChange={(e) => onSortChange(e.target.value as "popular" | "recent")}
            >
              <option value="recent">Recent</option>
              <option value="popular">Popular</option>
            </select>
          </div>}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {names.length > 0 ? (
            names.map((item) => (
              <div key={item.id} className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card/80 px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card sm:px-5">
                  <div className="left flex min-w-0 flex-col gap-1.5">
                    <h2 className="truncate text-lg font-bold tracking-tight">{item.nickname}</h2>
                    <p className="text-xs text-muted-foreground">By <span className="font-medium text-secondary">{item.publisher}</span></p>
                  </div>
                  <div className="right flex items-center gap-2">
                    <div className="copied-count flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1.5">
                      <CopyIcon className="h-3 w-3 text-primary" />
                      <p className="text-xs font-bold text-primary">{item.likes}</p>
                    </div>

                    <div className="rounded-lg p-2 transition-colors hover:bg-foreground/5">
                      <CopyButton text={item.nickname} />
                    </div>
                  </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/45 px-6 py-12 text-center">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary shadow-[0_0_36px_-14px_var(--primary)]">
                <Sparkles className="h-6 w-6" aria-hidden="true" />
              </div>
              <h4 className="text-lg font-bold tracking-tight sm:text-xl">No names here yet</h4>
              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                The name list is taking a breather. Check back soon for fresh ideas from the community.
              </p>
              <span className="mt-6 rounded-full border border-border bg-foreground/5 px-3 py-1 text-xs font-semibold text-secondary">
                New picks are on the way
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
