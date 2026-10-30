"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/icons/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { setNames } from "../actions";

export default function SubmitForm() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [publisherEmail, setpublisherEmail] = useState("");
  const [publisherName, setpublisherName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await setNames(nickname, publisherName, publisherEmail);

      if (!result.success) {
        setError(result.message ?? "Something went wrong");   
        setLoading(false);
        return;
      }

      // In actions.ts — make sure every return has a message
      if (error) return { success: false, message: error };

      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
      //empty inputs and success usestates
      setSuccess(false);
      setNickname("")
      setpublisherEmail("")
      setpublisherName("")
      setLoading(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Nav */}
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between border-b border-border/70 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo className="h-8 w-8 text-primary" />
          <span className="text-lg font-extrabold tracking-tight">
            Nameyry<span className="text-primary">.</span>
          </span>
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to names
        </Link>
      </nav>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-5 py-12 sm:py-16">
        <div className="w-full max-w-md">
          {success ? (
            <Card className="shadow-none">
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <svg
                    className="h-7 w-7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m5 13 4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight">
                  Name submitted!
                </h2>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll review it and publish soon. Redirecting…
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-none">
              <CardHeader className="pb-2">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-primary">
                  <span className="h-4 w-4 rounded-full bg-primary/15" />
                  <span>Contribute</span>
                </div>
                <CardTitle className="text-2xl tracking-tight">
                  Submit a name
                </CardTitle>
                <CardDescription>
                  Share a nickname you&apos;d love to see in the list.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="nickname">Nickname *</Label>
                    <Input
                      id="nickname"
                      placeholder="e.g. Mossbyte"
                      required
                      maxLength={30}
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {nickname.length}/30 characters
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="publisherEmail">Your Email *</Label>
                    <Input
                      id="publisherEmail"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={publisherEmail}
                      onChange={(e) => setpublisherEmail(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      This stays private and is only used for submission identity and rate limiting.
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="publisherName">Name to show publicly *</Label>
                    <Input
                      id="publisherName"
                      type="text"
                      required
                      placeholder="ex. Daniel Kim"
                      value={publisherName}
                      onChange={(e) => setpublisherName(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      This name appears below your nickname as its identity.
                    </p>
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Submitting…" : "Submit name"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/70 px-5 py-5 text-xs text-muted-foreground sm:px-8">
        <span>© 2026 – Nameyry</span>
      </footer>
    </main>
  );
}
