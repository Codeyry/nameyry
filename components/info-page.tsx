import Link from "next/link";
import Logo from "@/components/icons/Logo";

type InfoPageProps = {
  label: string;
  title: string;
  children: React.ReactNode;
};

export default function InfoPage({ label, title, children }: InfoPageProps) {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b border-border/70 px-5 py-4 sm:px-8">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo className="h-8 w-8" />
            <span className="text-lg font-extrabold tracking-tight">
              Nameyry<span className="text-primary">.</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to names
          </Link>
        </div>
      </header>

      <article className="mx-auto w-full max-w-3xl flex-1 px-5 py-16 sm:px-8 sm:py-24">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">
          {label}
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          {title}
        </h1>
        <div className="mt-8 space-y-6 text-base leading-7 text-muted-foreground">
          {children}
        </div>
      </article>

      <footer className="border-t border-border/70 px-5 py-5 text-center text-xs text-muted-foreground sm:px-8">
        © 2026 Nameyry
      </footer>
    </main>
  );
}
