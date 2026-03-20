# NICSC Password Strength Checker

**Network Information Computer Science Club — Cybersecurity Challenge**

An interactive, fully offline password strength checker built for the NICSC club event. Test how long it would take a hacker to crack your password and pick up quick, practical tips to secure your accounts.

---

## Features

- **Real-time strength analysis** — scores passwords from Very Weak to Very Strong as you type
- **Pattern analysis** — breaks down exactly which parts of your password are predictable (dictionary words, sequences, keyboard patterns, etc.)
- **Password generator** — cryptographically secure random passwords with configurable length and character sets
- **Actionable tips** — practical advice on building stronger passwords
- **Fully offline** — zero network requests; everything runs in your browser

---

## How It Works

Password analysis is powered by **[zxcvbn](https://github.com/dropbox/zxcvbn)**, an open-source estimator by Dropbox. It evaluates passwords the same way real attackers do — through dictionary lookups, pattern matching, and entropy calculations — rather than simple rules like "must contain a number."

Password generation uses the browser's built-in **Web Crypto API** (`crypto.getRandomValues`), which is cryptographically secure and requires no external library.

---

## Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [zxcvbn](https://github.com/dropbox/zxcvbn) — password strength estimation
- [Lucide React](https://lucide.dev/) — icons

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm --filter @workspace/password-checker run dev
```

The app will be available at `http://localhost:<PORT>`.

---

## Project Structure

```
artifacts/password-checker/
├── public/
│   └── nicsc-logo.png       # Club logo
├── src/
│   ├── App.tsx              # Main application component
│   ├── index.css            # Global styles and theme variables
│   └── components/ui/       # Shared UI components
├── index.html
├── package.json
└── vite.config.ts
```

---

## Color Scheme

The app uses the NICSC club's official colors:

| Role       | Value                  |
|------------|------------------------|
| Background | White `#ffffff`        |
| Text       | Near-black `#141414`   |
| Accent     | Gold `hsl(38, 85%, 42%)` |

---

## License

MIT — free to use, modify, and distribute.
