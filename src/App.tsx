import { useState, useCallback } from "react";
import zxcvbn from "zxcvbn";
import { Eye, EyeOff, Shield, ShieldCheck, ShieldAlert, ShieldX, Moon, Sun, Copy, Check, RefreshCw } from "lucide-react";

type ZxcvbnResult = ReturnType<typeof zxcvbn>;

const STRENGTH_CONFIG = [
  {
    label: "Very Weak",
    color: "bg-red-500",
    textColor: "text-red-500",
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    icon: ShieldX,
    segments: 1,
  },
  {
    label: "Weak",
    color: "bg-orange-500",
    textColor: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-800",
    icon: ShieldAlert,
    segments: 2,
  },
  {
    label: "Fair",
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-200 dark:border-yellow-800",
    icon: Shield,
    segments: 3,
  },
  {
    label: "Strong",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    icon: ShieldCheck,
    segments: 4,
  },
  {
    label: "Very Strong",
    color: "bg-green-500",
    textColor: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800",
    icon: ShieldCheck,
    segments: 5,
  },
];

function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
  const years = seconds / 31536000;
  if (years < 1000) return `${Math.round(years)} years`;
  if (years < 1e6) return `${(years / 1e3).toFixed(0)}k years`;
  if (years < 1e9) return `${(years / 1e6).toFixed(0)}M years`;
  return "centuries";
}

function formatCrackTime(crackTimeDisplay: string | number): string {
  const normalized = String(crackTimeDisplay ?? "");

  if (!normalized || normalized === "less than a second") {
    return "< 1 second";
  }

  return normalized;
}

const CHAR_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

function generatePassword(length: number, opts: { upper: boolean; lower: boolean; digits: boolean; symbols: boolean }): string {
  let charset = "";
  const required: string[] = [];

  if (opts.upper) { charset += CHAR_SETS.uppercase; required.push(CHAR_SETS.uppercase[Math.floor(Math.random() * CHAR_SETS.uppercase.length)]); }
  if (opts.lower) { charset += CHAR_SETS.lowercase; required.push(CHAR_SETS.lowercase[Math.floor(Math.random() * CHAR_SETS.lowercase.length)]); }
  if (opts.digits) { charset += CHAR_SETS.digits; required.push(CHAR_SETS.digits[Math.floor(Math.random() * CHAR_SETS.digits.length)]); }
  if (opts.symbols) { charset += CHAR_SETS.symbols; required.push(CHAR_SETS.symbols[Math.floor(Math.random() * CHAR_SETS.symbols.length)]); }

  if (!charset) charset = CHAR_SETS.lowercase;

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  let password = Array.from(arr).map((n) => charset[n % charset.length]).join("");

  for (let i = 0; i < required.length && i < length; i++) {
    const pos = Math.floor(Math.random() * length);
    password = password.slice(0, pos) + required[i] + password.slice(pos + 1);
  }

  return password;
}

export default function App() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [genLength, setGenLength] = useState(16);
  const [genOpts, setGenOpts] = useState({ upper: true, lower: true, digits: true, symbols: false });

  const result: ZxcvbnResult | null = password ? zxcvbn(password) : null;
  const score = result ? result.score : -1;
  const config = score >= 0 ? STRENGTH_CONFIG[score] : null;

  const copyPassword = useCallback(async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be unavailable
    }
  }, [password]);

  const handleGenerate = useCallback(() => {
    const pwd = generatePassword(genLength, genOpts);
    setPassword(pwd);
    setShowPassword(true);
  }, [genLength, genOpts]);

  const StrengthIcon = config?.icon ?? Shield;

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        {/* Header */}
        <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src="/nicsc-logo.png"
                alt="nics Logo"
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-base font-semibold leading-tight text-amber-700 electric-glow electric-flicker">Can You Crack It?</h1>
                <p className="text-xs text-muted-foreground">nics Cybersecurity Challenge</p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          {/* Input Card */}
          <div className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
            <label className="block text-sm font-medium mb-2">Enter a Password &mdash; See How Long It Takes to Crack</label>
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type or paste a password..."
                  className="w-full h-11 rounded-lg border border-input bg-background px-4 pr-10 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <button
                  onClick={copyPassword}
                  className="h-11 px-3 rounded-lg border border-input bg-background hover:bg-accent transition-colors flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  aria-label="Copy password"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>

            {/* Character count */}
            {password && (
              <p className="mt-2 text-xs text-muted-foreground">{password.length} characters</p>
            )}
          </div>

          {/* Strength Meter */}
          {result && config && (
            <div className={`rounded-xl border ${config.border} ${config.bg} p-6 transition-all duration-300`}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.color}/15`}>
                  <StrengthIcon className={`w-5 h-5 ${config.textColor}`} />
                </div>
                <div>
                  <p className="text-xs text-amber-700/70 font-medium uppercase tracking-wider">Password Strength</p>
                  <p className={`text-xl font-bold ${config.textColor} electric-glow electric-pulse`}>{config.label}</p>
                </div>
              </div>

              {/* Strength bars */}
              <div className="flex gap-1.5 mb-6">
                {STRENGTH_CONFIG.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                      i < config.segments
                        ? config.color
                        : "bg-border"
                    }`}
                  />
                ))}
              </div>

              {/* Crack time */}
              <div className="rounded-lg bg-background/60 p-4 mb-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Estimated Time to Crack
                </p>
                <p className={`text-lg font-semibold ${config.textColor}`}>
                  {formatCrackTime(result.crack_times_display.offline_slow_hashing_1e4_per_second)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on offline attack at ~10k guesses/sec
                </p>
              </div>

              {/* Feedback */}
              {(result.feedback.warning || result.feedback.suggestions.length > 0) && (
                <div className="rounded-lg bg-background/60 p-4 space-y-2">
                  {result.feedback.warning && (
                    <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      ⚠ {result.feedback.warning}
                    </p>
                  )}
                  {result.feedback.suggestions.map((s, i) => (
                    <p key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">→</span>
                      {s}
                    </p>
                  ))}
                </div>
              )}

              {/* Pattern analysis */}
              {result.sequence.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Pattern Analysis</p>
                  <div className="flex flex-wrap gap-2">
                    {result.sequence.map((match, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-1 rounded-md bg-background/70 border border-border text-xs"
                      >
                        <span className="font-mono font-medium mr-1.5">{String(match.token)}</span>
                        <span className="text-muted-foreground capitalize">{String(match.pattern)}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!password && (
            <div className="rounded-xl border border-card-border bg-card p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">Type any password to find out how long a hacker would need to crack it</p>
            </div>
          )}

          {/* Password Generator */}
          <div className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold">Password Generator</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Create a strong random password</p>
              </div>
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </div>

            {/* Length slider */}
            <div className="mb-5">
              <div className="flex justify-between mb-2">
                <label className="text-xs font-medium text-muted-foreground">Length</label>
                <span className="text-xs font-bold text-primary">{genLength}</span>
              </div>
              <input
                type="range"
                min={8}
                max={64}
                value={genLength}
                onChange={(e) => setGenLength(Number(e.target.value))}
                className="w-full h-2 rounded-full accent-primary cursor-pointer"
              />
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>8</span>
                <span>64</span>
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              {([
                { key: "upper", label: "Uppercase (A-Z)" },
                { key: "lower", label: "Lowercase (a-z)" },
                { key: "digits", label: "Numbers (0-9)" },
                { key: "symbols", label: "Symbols (!@#$)" },
              ] as const).map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      genOpts[key]
                        ? "bg-primary border-primary"
                        : "border-border group-hover:border-primary/50"
                    }`}
                    onClick={() => setGenOpts((prev) => ({ ...prev, [key]: !prev[key] }))}
                  >
                    {genOpts[key] && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                  </div>
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 active:opacity-80 transition-opacity flex items-center justify-center gap-2 electric-glow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Generate Password
            </button>
          </div>

          {/* Info Card */}
          <div className="rounded-xl border border-card-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold mb-3">Quick Tips for Stronger Passwords</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-start gap-2"><span className="text-amber-700 mt-0.5 font-bold">→</span> Use a <strong className="text-foreground">passphrase</strong> — a random string of 4+ words is hard to crack and easy to remember.</p>
              <p className="flex items-start gap-2"><span className="text-amber-700 mt-0.5 font-bold">→</span> Mix in <strong className="text-foreground">numbers and symbols</strong> — but not in obvious spots like replacing "a" with "@".</p>
              <p className="flex items-start gap-2"><span className="text-amber-700 mt-0.5 font-bold">→</span> <strong className="text-foreground">Never reuse</strong> passwords — one breach can expose every account you have.</p>
              <p className="flex items-start gap-2"><span className="text-amber-700 mt-0.5 font-bold">→</span> Use a <strong className="text-foreground">password manager</strong> to generate and store unique passwords for each site.</p>
            </div>
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Score 0-1</p>
                <p className="text-xs font-medium text-red-500 mt-1">Too weak</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Score 2-3</p>
                <p className="text-xs font-medium text-yellow-500 mt-1">Acceptable</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Score 4</p>
                <p className="text-xs font-medium text-green-500 mt-1">Very strong</p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground pb-4">
            NICS Club &mdash; No data leaves your device
          </p>
        </main>
      </div>
    </div>
  );
}
