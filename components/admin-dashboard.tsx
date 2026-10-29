"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Clock3,
  Database,
  Filter,
  Heart,
  Search,
  Trash2,
  Users,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { deleteName, publishName, updateNameLikes, updateSettings } from "@/app/actions"

function OverviewCard({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof Database;
}) {
  return (
    <Card className="shadow-none">
      <CardContent className="flex items-center gap-4 p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-0.5 text-2xl font-bold tracking-tight">{value}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>
        </div>
      </CardContent>
    </Card>
  );
}



type PendingName = {
  id: number;
  nickname: string;
  publisher: string;
  publisher_email: string;
  likes: number;
  created_at: string;
};

type ManagedName = PendingName & {
  status: "pending" | "published";
};


export default function AdminDashboard({ pending, published, adminEmail, totalNames, settings }: { pending: PendingName[], published: PendingName[], adminEmail?: string, totalNames: number, settings: { maintenance_mode: boolean; accept_submissions: boolean }}) {
  const [pendingNames, setPendingNames] = useState<ManagedName[]>(pending.map((name) => ({ ...name, status: "pending" })));
  const [publishedNames, setPublishedNames] = useState<ManagedName[]>(published.map((name) => ({ ...name, status: "published" })));
  const [view, setView] = useState<"pending" | "published">("pending");
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState<"nickname" | "publisher">("nickname");
  const [maintenance, setMaintenance] = useState(settings?.maintenance_mode);
  const [submissionsOpen, setSubmissionsOpen] = useState(settings?.accept_submissions);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [likesDrafts, setLikesDrafts] = useState<Record<number, string>>({});

  const names = view === "pending" ? pendingNames : publishedNames;

  const filteredNames = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term
      ? names.filter((name) => name[searchBy].toLowerCase().includes(term))
      : names;
  }, [names, query, searchBy]);

  async function handlePublish(id: number) {
    setBusyId(id);
    const result = await publishName(id);
    setBusyId(null);
    if (!result.success) {
      setMessage(`Could not publish the name: ${result.message}`);
      return;
    }

    const name = pendingNames.find((item) => item.id === id);
    if (name) {
      setPendingNames((current) => current.filter((item) => item.id !== id));
      setPublishedNames((current) => [{ ...name, status: "published" }, ...current]);
    }
    setMessage("Name published.");
  }

  async function handleDelete(name: ManagedName) {
    if (!window.confirm(`Delete "${name.nickname}" permanently?`)) return;

    setBusyId(name.id);
    const result = await deleteName(name.id);
    setBusyId(null);
    if (!result.success) {
      setMessage(`Could not delete the name: ${result.message}`);
      return;
    }

    if (name.status === "pending") {
      setPendingNames((current) => current.filter((item) => item.id !== name.id));
    } else {
      setPublishedNames((current) => current.filter((item) => item.id !== name.id));
    }
    setMessage("Name deleted.");
  }

  async function handleLikesUpdate(name: ManagedName) {
    const value = likesDrafts[name.id] ?? String(name.likes);
    const likes = Number(value);
    if (!Number.isInteger(likes) || likes < 0) {
      setMessage("Likes must be a whole number greater than or equal to zero.");
      return;
    }

    setBusyId(name.id);
    const result = await updateNameLikes(name.id, likes);
    setBusyId(null);
    if (!result.success) {
      setMessage(`Could not update likes: ${result.message}`);
      return;
    }

    const updateLikes = (current: ManagedName[]) =>
      current.map((item) => item.id === name.id ? { ...item, likes } : item);
    setPendingNames(updateLikes);
    setPublishedNames(updateLikes);
    setLikesDrafts((current) => {
      const next = { ...current };
      delete next[name.id];
      return next;
    });
    setMessage(`Likes for "${name.nickname}" updated.`);
  }

  function timeAgo(dateStr: string) {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-muted/30 dark:bg-[#172820]">
      <div className="mx-auto w-full max-w-7xl px-5 pb-14 pt-8 sm:px-8">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">A quick snapshot of Nameyry{adminEmail ? ` · ${adminEmail}` : ""}.</p>
        </div>
        <Badge variant="secondary" className="rounded-full">Live data</Badge>
      </header>

      <section aria-label="Website overview" className="grid gap-3 sm:grid-cols-3">
        <OverviewCard label="Names in database" value={String(totalNames)} note="Published and pending" icon={Database} />
        <OverviewCard label="Pending review" value={String(pendingNames.length)} note="Awaiting your decision" icon={Clock3} />
        <OverviewCard label="Visitors this month" value="10929" note="Unique browsers · October" icon={Users} />
      </section>

      <Card className="mt-6 overflow-hidden shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">Name management</h2>
                <Badge variant="secondary">{names.length}</Badge>
              </div>
              <div className="mt-3 flex gap-1 rounded-lg bg-muted p-1 text-sm">
                <button type="button" onClick={() => setView("pending")} className={`rounded-md px-3 py-1.5 ${view === "pending" ? "bg-background font-medium shadow-sm" : "text-muted-foreground"}`}>
                  Pending ({pendingNames.length})
                </button>
                <button type="button" onClick={() => setView("published")} className={`rounded-md px-3 py-1.5 ${view === "published" ? "bg-background font-medium shadow-sm" : "text-muted-foreground"}`}>
                  Published ({publishedNames.length})
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{view === "pending" ? "Check each submission before publishing." : "Manage names currently visible on the public site."}</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${searchBy}...`}
                className="pl-9"
                aria-label={`Search by ${searchBy}`}
              />
            </div>
            <label className="flex h-9 items-center gap-2 rounded-md border bg-background px-3 text-sm">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="sr-only">Search field</span>
              <select value={searchBy} onChange={(event) => setSearchBy(event.target.value as "nickname" | "publisher")} className="bg-transparent outline-none">
                <option value="nickname">Nickname</option>
                <option value="publisher">Publisher</option>
              </select>
            </label>
          </div>
        </div>

        {message && <p role="status" className="border-b bg-muted px-5 py-2 text-sm text-muted-foreground">{message}</p>}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Nickname</th>
                <th className="px-4 py-3 font-medium">Publisher</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Likes</th>
                <th className="px-4 py-3 font-medium">Submitted</th>
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredNames.map((name) => (
                <tr key={name.id} className="hover:bg-muted/30">
                  <td className="px-5 py-3.5"><p className="font-medium">{name.nickname}</p><p className="mt-0.5 text-xs text-muted-foreground">{name.status === "pending" ? "Pending" : "Published"}</p></td>
                  <td className="px-4 py-3.5">{name.publisher}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{name.publisher_email}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <Heart className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={likesDrafts[name.id] ?? String(name.likes)}
                        onChange={(event) => setLikesDrafts((current) => ({ ...current, [name.id]: event.target.value }))}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") handleLikesUpdate(name);
                        }}
                        className="h-8 w-24"
                        aria-label={`Likes for ${name.nickname}`}
                        disabled={busyId === name.id}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">{timeAgo(name.created_at)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleLikesUpdate(name)} disabled={busyId === name.id}><Check />Save likes</Button>
                      {name.status === "pending" && <Button size="sm" onClick={() => handlePublish(name.id)} disabled={busyId === name.id}><Check />Publish</Button>}
                      <Button size="icon" variant="outline" aria-label={`Delete ${name.nickname}`} onClick={() => handleDelete(name)} disabled={busyId === name.id}><Trash2 /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredNames.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">No matching names.</td></tr>}
            </tbody>
          </table>
        </div>
        <p className="border-t px-5 py-3 text-xs text-muted-foreground">Showing {filteredNames.length} of {names.length} {view} names</p>
      </Card>

      <section className="mt-6 grid gap-6 lg:grid-cols-2" aria-label="Site settings">
        <Card className="shadow-none">
          <CardContent className="p-5">
            <div className="mb-4 flex items-center gap-2"><Wrench className="h-4 w-4 text-primary" /><h2 className="font-semibold">Site availability</h2></div>
            <div className="space-y-4">
              {!settings || settings.maintenance_mode === null ? (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Maintenance mode</p>
                    <p className="text-xs text-muted-foreground">Show a temporary pause notice.</p>
                  </div>
                  <Switch disabled={settings?.maintenance_mode === null} checked={false} onCheckedChange={() => {}} aria-label="Maintenance mode" />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Maintenance mode</p>
                    <p className="text-xs text-muted-foreground">Show a temporary pause notice.</p>
                  </div>
                  <Switch checked={maintenance} onCheckedChange={(val) => { setMaintenance(val); updateSettings("maintenance_mode", val);}} aria-label="Maintenance mode" />
                </div>
              )}

              {!settings || settings.accept_submissions === null ? (
                <div className="flex items-center justify-between gap-4 border-t pt-4">
                  <div><p className="text-sm font-medium">Accept submissions</p><p className="text-xs text-muted-foreground">Allow new name requests.</p></div>
                  <Switch disabled={settings?.accept_submissions === null} checked={false} onCheckedChange={() => {}} aria-label="Accept submissions" />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4 border-t pt-4">
                  <div><p className="text-sm font-medium">Accept submissions</p><p className="text-xs text-muted-foreground">Allow new name requests.</p></div>
                  <Switch checked={submissionsOpen} onCheckedChange={(val) => { setSubmissionsOpen(val); updateSettings("accept_submissions", val); }} aria-label="Accept submissions" />
              </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardContent className="p-5">
            <h2 className="font-semibold">Quick settings</h2>
            <p className="mt-1 text-sm text-muted-foreground">Keep your admin tools close.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" asChild>
                <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">Open Supabase <ArrowUpRight /></a>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">View public site <ArrowUpRight /></Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <p className="mt-5 text-center text-xs text-muted-foreground">Changes are saved to the database immediately.</p>
      </div>
    </div>
  );
}
