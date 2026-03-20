# NICS Password Strength Checker

Interactive password-strength checker and generator for the NICS cybersecurity challenge.

## Features

- Real-time password scoring (Very Weak -> Very Strong) using `zxcvbn`
- Estimated crack time display (offline slow hashing scenario)
- Pattern analysis (dictionary words, sequences, brute-force segments, etc.)
- Password generator with configurable length and character sets
- Copy-to-clipboard and dark mode support
- Quick security tips section with practical guidance

## How It Works

- Password analysis is powered by [zxcvbn](https://github.com/dropbox/zxcvbn)
- Crack time uses `zxcvbn` crack-time estimates
- Password generation uses the browser Web Crypto API (`crypto.getRandomValues`)

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- Lucide React icons
- zxcvbn

## Local Development

Using npm:

```bash
npm install
npm run dev
```

Using pnpm:

```bash
pnpm install
pnpm run dev
```

## Build

```bash
npm run build
```

Build output directory: `dist`

Preview production build:

```bash
npm run preview
```

## Vercel Deployment

This project is configured for Vercel via `vercel.json`:

- Framework: `vite`
- Build command: `npm run build`
- Output directory: `dist`
- SPA rewrite to `index.html` for client-side routing

Deploy from GitHub:

1. Push your latest changes to `main`
2. Import the repo in Vercel
3. Keep defaults (or use existing `vercel.json`)
4. Deploy

## Scripts

- `dev` -> `vite`
- `build` -> `vite build`
- `preview` -> `vite preview`
- `typecheck` -> `tsc -p tsconfig.json --noEmit`

## Project Structure

```text
.
├── public/
│   └── nicsc-logo.png
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── components/ui/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vercel.json
```

## License

MIT
