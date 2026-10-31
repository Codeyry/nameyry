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
import {
  deleteName,
  publishName,
  updateNameLikes,
  updateSettings,
} from "@/app/actions";

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

export default function AdminDashboard({
  pending,
  published,
  adminEmail,
  totalNames,
  settings,
}: {
  pending: PendingName[];
  published: PendingName[];
  adminEmail?: string;
  totalNames: number;
  settings: { maintenance_mode: boolean; accept_submissions: boolean; total_visitors: number };
}) {
  const [pendingNames, setPendingNames] = useState<ManagedName[]>(
    pending.map((name) => ({ ...name, status: "pending" })),
  );
  const [publishedNames, setPublishedNames] = useState<ManagedName[]>(
    published.map((name) => ({ ...name, status: "published" })),
  );
  const [view, setView] = useState<"pending" | "published">("pending");
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState<"nickname" | "publisher">(
    "nickname",
  );
  const [maintenance, setMaintenance] = useState(settings?.maintenance_mode);
  const [submissionsOpen, setSubmissionsOpen] = useState(
    settings?.accept_submissions,
  );
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
      setPublishedNames((current) => [
        { ...name, status: "published" },
        ...current,
      ]);
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
      setPendingNames((current) =>
        current.filter((item) => item.id !== name.id),
      );
    } else {
      setPublishedNames((current) =>
        current.filter((item) => item.id !== name.id),
      );
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
      current.map((item) => (item.id === name.id ? { ...item, likes } : item));
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
      <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-6 sm:px-8 sm:pt-8">
        <header className="mb-6 flex flex-col items-start gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Admin overview
            </h1>
            <p className="mt-1 break-words text-xs leading-5 text-muted-foreground sm:text-sm">
              A quick snapshot of Nameyry{adminEmail ? ` · ${adminEmail}` : ""}.
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0 rounded-full">
            Live data
          </Badge>
        </header>

        <section
          aria-label="Website overview"
          className="grid gap-3 sm:grid-cols-3"
        >
          <OverviewCard
            label="Names in database"
            value={String(totalNames)}
            note="Published and pending"
            icon={Database}
          />
          <OverviewCard
            label="Pending review"
            value={String(pendingNames.length)}
            note="Awaiting your decision"
            icon={Clock3}
          />
          <OverviewCard
            label="Total Visitor till now"
            value={String(settings.total_visitors)}
            note="Home page opens number"
            icon={Users}
          />
        </section>

        <Card className="mt-6 overflow-hidden shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b p-4 sm:p-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">Name management</h2>
                  <Badge variant="secondary">{names.length}</Badge>
                </div>
                <div className="flex w-full gap-1 rounded-lg bg-muted p-1 text-sm sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setView("pending")}
                    className={`flex-1 rounded-md px-3 py-1.5 sm:flex-none ${view === "pending" ? "bg-background font-medium shadow-sm" : "text-muted-foreground"}`}
                  >
                    Pending ({pendingNames.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("published")}
                    className={`flex-1 rounded-md px-3 py-1.5 sm:flex-none ${view === "published" ? "bg-background font-medium shadow-sm" : "text-muted-foreground"}`}
                  >
                    Published ({publishedNames.length})
                  </button>
                </div>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {view === "pending"
                  ? "Check each submission before publishing."
                  : "Manage names currently visible on the public site."}
              </p>
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
                <select
                  value={searchBy}
                  onChange={(event) =>
                    setSearchBy(event.target.value as "nickname" | "publisher")
                  }
                  className="bg-transparent outline-none"
                >
                  <option value="nickname">Nickname</option>
                  <option value="publisher">Publisher</option>
                </select>
              </label>
            </div>
          </div>

          {message && (
            <p
              role="status"
              className="border-b bg-muted px-5 py-2 text-sm text-muted-foreground"
            >
              {message}
            </p>
          )}

          <div className="space-y-3 p-4 md:hidden">
            {filteredNames.map((name) => (
              <article key={name.id} className="rounded-lg border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words font-medium">{name.nickname}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {name.status === "pending" ? "Pending" : "Published"} ·{" "}
                      {timeAgo(name.created_at)}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {name.likes} likes
                  </Badge>
                </div>
                <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                  <dt className="text-muted-foreground">Publisher</dt>
                  <dd className="min-w-0 break-words text-right">{name.publisher}</dd>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="min-w-0 break-all text-right text-muted-foreground">
                    {name.publisher_email}
                  </dd>
                </dl>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <label className="flex min-w-[8rem] flex-1 items-center gap-2">
                    <Heart className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      value={likesDrafts[name.id] ?? String(name.likes)}
                      onChange={(event) =>
                        setLikesDrafts((current) => ({
                          ...current,
                          [name.id]: event.target.value,
                        }))
                      }
                      onKeyDown={(event) => {
                        if (event.key === "Enter") handleLikesUpdate(name);
                      }}
                      className="h-8"
                      aria-label={`Likes for ${name.nickname}`}
                      disabled={busyId === name.id}
                    />
                  </label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLikesUpdate(name)}
                    disabled={busyId === name.id}
                  >
                    <Check />
                    Save
                  </Button>
                  {name.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handlePublish(name.id)}
                      disabled={busyId === name.id}
                    >
                      <Check />
                      Publish
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="outline"
                    aria-label={`Delete ${name.nickname}`}
                    onClick={() => handleDelete(name)}
                    disabled={busyId === name.id}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </article>
            ))}
            {filteredNames.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No matching names.
              </p>
            )}
          </div>

          <div className="hidden overflow-x-auto md:block">
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
                    <td className="px-5 py-3.5">
                      <p className="font-medium">{name.nickname}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {name.status === "pending" ? "Pending" : "Published"}
                      </p>
                    </td>
                    <td className="px-4 py-3.5">{name.publisher}</td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {name.publisher_email}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <Heart className="h-3.5 w-3.5 shrink-0 text-primary" />
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          value={likesDrafts[name.id] ?? String(name.likes)}
                          onChange={(event) =>
                            setLikesDrafts((current) => ({
                              ...current,
                              [name.id]: event.target.value,
                            }))
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Enter") handleLikesUpdate(name);
                          }}
                          className="h-8 w-24"
                          aria-label={`Likes for ${name.nickname}`}
                          disabled={busyId === name.id}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-muted-foreground">
                      {timeAgo(name.created_at)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLikesUpdate(name)}
                          disabled={busyId === name.id}
                        >
                          <Check />
                          Save likes
                        </Button>
                        {name.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => handlePublish(name.id)}
                            disabled={busyId === name.id}
                          >
                            <Check />
                            Publish
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="outline"
                          aria-label={`Delete ${name.nickname}`}
                          onClick={() => handleDelete(name)}
                          disabled={busyId === name.id}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredNames.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-12 text-center text-muted-foreground"
                    >
                      No matching names.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="border-t px-4 py-3 text-xs text-muted-foreground sm:px-5">
            Showing {filteredNames.length} of {names.length} {view} names
          </p>
        </Card>

        <section
          className="mt-6 grid gap-6 lg:grid-cols-2"
          aria-label="Site settings"
        >
          <Card className="shadow-none">
            <CardContent className="p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-primary" />
                <h2 className="font-semibold">Site availability</h2>
              </div>
              <div className="space-y-4">
                {!settings || settings.maintenance_mode === null ? (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">Maintenance mode</p>
                      <p className="text-xs text-muted-foreground">
                        Show a temporary pause notice.
                      </p>
                    </div>
                    <Switch
                      disabled={settings?.maintenance_mode === null}
                      checked={false}
                      onCheckedChange={() => {}}
                      aria-label="Maintenance mode"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">Maintenance mode</p>
                      <p className="text-xs text-muted-foreground">
                        Show a temporary pause notice.
                      </p>
                    </div>
                    <Switch
                      checked={maintenance}
                      onCheckedChange={(val) => {
                        setMaintenance(val);
                        updateSettings("maintenance_mode", val);
                      }}
                      aria-label="Maintenance mode"
                    />
                  </div>
                )}

                {!settings || settings.accept_submissions === null ? (
                  <div className="flex items-center justify-between gap-4 border-t pt-4">
                    <div>
                      <p className="text-sm font-medium">Accept submissions</p>
                      <p className="text-xs text-muted-foreground">
                        Allow new name requests.
                      </p>
                    </div>
                    <Switch
                      disabled={settings?.accept_submissions === null}
                      checked={false}
                      onCheckedChange={() => {}}
                      aria-label="Accept submissions"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4 border-t pt-4">
                    <div>
                      <p className="text-sm font-medium">Accept submissions</p>
                      <p className="text-xs text-muted-foreground">
                        Allow new name requests.
                      </p>
                    </div>
                    <Switch
                      checked={submissionsOpen}
                      onCheckedChange={(val) => {
                        setSubmissionsOpen(val);
                        updateSettings("accept_submissions", val);
                      }}
                      aria-label="Accept submissions"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardContent className="p-4 sm:p-5">
              <h2 className="font-semibold">Quick settings</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Keep your admin tools close.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Button variant="outline" className="w-full sm:w-auto" asChild>
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Supabase <ArrowUpRight />
                  </a>
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" asChild>
                  <Link href="/">
                    View public site <ArrowUpRight />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Changes are saved to the database immediately.
        </p>
      </div>
    </div>
  );
}
