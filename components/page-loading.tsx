type PageLoadingProps = {
  label?: string;
};

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted ${className}`} />;
}

export default function PageLoading({
  label = "Loading Nameyry",
}: PageLoadingProps) {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      aria-label={label}
      className="flex min-h-screen flex-col"
    >
      <header className="border-b border-border/70 px-5 py-4 sm:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-8 rounded-xl bg-primary/20" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex items-center gap-5 sm:gap-7">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="hidden h-9 w-28 rounded-full sm:block" />
          </div>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-5 py-20 sm:px-8 sm:py-28">
        <Skeleton className="mb-5 h-7 w-48 rounded-full bg-primary/10" />
        <Skeleton className="h-11 w-[min(36rem,90vw)] rounded-xl sm:h-16" />
        <Skeleton className="mt-3 h-6 w-[min(28rem,82vw)] rounded-lg" />
        <Skeleton className="mt-2 h-6 w-[min(20rem,70vw)] rounded-lg" />
        <div className="mt-16 w-full max-w-2xl">
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </section>

      <footer className="border-t border-border/70 px-5 py-5 sm:px-8">
        <Skeleton className="mx-auto h-3 w-64 sm:mx-0" />
      </footer>
    </main>
  );
}
