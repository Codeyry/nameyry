# Nameyry

Nameyry is a small community app for discovering and sharing nicknames for
games, creative projects, and online identities. Jst an web to make as an project and also may be helpful for names , you can publish your liking there also so just do it for fun at least.

## Features

- Browse, search, copy, and sort community nicknames.
- Submit a nickname with a public display name.
- Keep submitter email addresses private.
- Admin dashboard for reviewing and publishing submissions.
- Maintenance mode and submission controls.
- Responsive UI with light and dark theme support.

## Tech stack

- [Next.js](https://nextjs.org/) App Router
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Vercel](https://vercel.com/) for deployment

## Run locally

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/nameyry.git
cd nameyry
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-public-anon-or-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
```

The service-role key is used only by server actions and must never be committed
or exposed in a `NEXT_PUBLIC_*` variable.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase setup

The app expects these tables:

### `nicknames`

The nickname table should include:

- `id`
- `nickname`
- `publisher`
- `publisher_email`
- `likes`
- `status`
- `created_at`

Published names use `status = 'published'`. New submissions use
`status = 'pending'`.

### `settings`

The settings table should include one row with:

- `maintenance_mode` — controls whether the public home page is paused.
- `accept_submissions` — controls whether new nickname submissions are open.

The application reads the first settings row. The admin dashboard can update
these switches.

## Available routes

- `/` — public nickname list
- `/submit` — submit a nickname when submissions are enabled
- `/contact` — contact links
- `/feedback` — feedback links
- `/privacy` — privacy information
- `/protected` — admin dashboard

## Useful commands

```bash
npm run dev      # Start the development server
npm run lint     # Run ESLint
npm run build    # Create a production build
npm run start    # Start the production server
```

## Privacy

The submitted display name appears below the nickname on the public website.
The submitted email address is not included in public nickname queries. It is
used for submission identity and short-term rate limiting.

## Contact

- Telegram: [@codeyry](https://t.me/codeyry)
- Portfolio: [codeyry.vercel.app](https://codeyry.vercel.app)
