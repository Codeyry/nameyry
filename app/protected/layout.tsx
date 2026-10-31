import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col bg-muted/30 dark:bg-[#172820]">
      <div className="flex min-h-screen w-full flex-col">
        <nav className="sticky top-0 z-20 w-full border-b bg-background/80 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-3 sm:px-8">
            <div className="flex shrink-0 items-center gap-3 font-semibold">
              <Link href="/" className="text-base font-extrabold tracking-tight">Nameyry<span className="text-primary">.</span></Link>
              <span className="hidden h-5 w-px bg-border sm:block" />
              <span className="hidden text-sm font-medium text-muted-foreground sm:block">Admin</span>
            </div>
            <div className="flex min-w-0 items-center justify-end gap-1.5 sm:gap-4">
              <span className="hidden items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground md:inline-flex"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Preview dashboard</span>
              <ThemeSwitcher />
              {!hasEnvVars ? <EnvVarWarning /> : <Suspense><AuthButton /></Suspense>}
            </div>
          </div>
        </nav>
        <div className="w-full flex-1">
          {children}
        </div>

        <footer className="w-full border-t">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 text-xs text-muted-foreground sm:px-8">
            <p>Nameyry Admin</p>
            <p>Manage your community with care.</p>
          </div>
        </footer>
      </div>
    </main>
  );
}
