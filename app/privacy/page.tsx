import InfoPage from "@/components/info-page";

export default function PrivacyPage() {
  return (
    <InfoPage label="Privacy" title="Your information stays simple.">
      <p>
        Nameyry shows the nickname you submit and the name you provide as its
        public identity. Your email address is not shown on the public website.
      </p>
      <p>
        We use your email to help identify your submission and prevent repeated
        submissions in a short period. Please do not submit information that
        you do not want stored with your name submission.
      </p>
      <p>
        If you have a question about your information or want a submission
        removed, contact me through{" "}
        <a
          className="font-medium text-primary hover:underline"
          href="https://t.me/codeyry"
          target="_blank"
          rel="noreferrer"
        >
          Telegram
        </a>
        .
      </p>
    </InfoPage>
  );
}
