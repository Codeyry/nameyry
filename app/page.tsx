import MainSection from "@/components/MainSection";
import Logo from "@/components/icons/Logo";
import Link from "next/link";
import StarIcon from "@/components/icons/StarIcon";
import MaintenanceScreen from "@/components/maintenance-screen";

import { getNames, getSettings } from "./actions";

export default async function Home() {
  const settings = await getSettings();

  if (settings?.maintenance_mode === true) {
    return <MaintenanceScreen />;
  }

  const names = await getNames();

  return (
    <main className="min-h-screen flex flex-col">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between border-b border-border/70 px-5 py-4 sm:px-8">
        <div className="logo flex items-center gap-2.5">
          <Logo className="h-8 w-8 text-primary" />
          <h2 className="text-lg font-extrabold tracking-tight">Nameyry<span className="text-primary">.</span></h2>
        </div>

        <div className="flex items-center gap-5 text-sm font-medium text-muted-foreground sm:gap-7">
          <Link className="transition-colors hover:text-foreground" href="/submit">Submit Name</Link>
          <Link className="transition-colors hover:text-foreground" href="/contact">Contact</Link>
          <div className="gitStar hidden items-center gap-2 rounded-full border border-border bg-foreground/5 px-3 py-2 text-foreground sm:flex">
            <StarIcon className="h-4 w-4 text-primary" />
            <Link href="https://github.com/Codeyry/nameyry">Star on GitHub</Link>
          </div>
        </div>
      </nav>

      <section className="flex flex-col items-center px-5 pb-9 pt-20 text-center sm:pb-12 sm:pt-28">
        <span className="mb-5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary">Your next name starts here</span>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-[-0.055em] sm:text-6xl">Find a name that <span className="text-primary">feels like you.</span></h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Fresh nicknames for games, creative projects, and wherever you show up online.</p>
      </section>

      <MainSection initialNames={names ?? []} />

      <footer className="mt-auto flex flex-col justify-between gap-3 border-t border-border/70 px-5 py-5 text-xs text-muted-foreground sm:flex-row sm:px-8">
        <span>© : 2026 - Nameyry</span>
        <div className="footer-nav flex items-center gap-5">
            <Link className="transition-colors hover:text-foreground" href="/privacy">Privacy</Link>
            <Link className="transition-colors hover:text-foreground" href="/contact">Contact</Link>
            <Link className="transition-colors hover:text-foreground" href="/feedback">Feedback</Link>
        </div>
      </footer>
    </main>
  );
}
