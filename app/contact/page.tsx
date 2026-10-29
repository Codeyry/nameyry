import InfoPage from "@/components/info-page";

export default function ContactPage() {
  return (
    <InfoPage label="Contact" title="Have something to share?">
      <p>
        For questions, ideas, or anything else, reach out through Telegram or
        visit my portfolio.
      </p>
      <div className="flex flex-wrap gap-3 pt-2">
        <a
          className="rounded-xl bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          href="https://t.me/codeyry"
          target="_blank"
          rel="noreferrer"
        >
          Message on Telegram
        </a>
        <a
          className="rounded-xl border border-border px-4 py-2.5 font-semibold text-foreground transition-colors hover:bg-muted"
          href="https://codeyry.vercel.app"
          target="_blank"
          rel="noreferrer"
        >
          Visit my portfolio
        </a>
      </div>
    </InfoPage>
  );
}
