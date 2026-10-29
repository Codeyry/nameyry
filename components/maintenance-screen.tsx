import Logo from "@/components/icons/Logo";

type MaintenanceScreenProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  icon?: string;
};

export default function MaintenanceScreen({
  eyebrow = "We'll be right back",
  title = "Nameyry is taking a short break.",
  description = "We're making a few improvements behind the scenes. Please check back soon.",
  icon = "🔧",
}: MaintenanceScreenProps) {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b border-border/70 px-5 py-4 sm:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2.5">
          <Logo className="h-8 w-8" />
          <span className="text-lg font-extrabold tracking-tight">
            Nameyry<span className="text-primary">.</span>
          </span>
        </div>
      </header>

      <section className="flex flex-1 items-center justify-center px-5 py-16 text-center">
        <div className="w-full max-w-lg">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
            {icon}
          </div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            {eyebrow}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </p>
        </div>
      </section>

      <footer className="border-t border-border/70 px-5 py-5 text-center text-xs text-muted-foreground sm:px-8">
        Thanks for your patience.
      </footer>
    </main>
  );
}
