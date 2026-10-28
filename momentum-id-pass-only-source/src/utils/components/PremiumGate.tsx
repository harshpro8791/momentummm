import { useState } from "react";
import { Card } from "@/components/ui";
import { confetti, toast } from "@/components/effects";
import { formatExpiry, premiumActive, type PremiumLicense } from "@/lib/billing";
import { hexToRgba } from "@/lib/accents";
import { cn } from "@/utils/cn";

export default function PremiumGate({
  accent,
  premium,
  onUnlock,
  onReset,
  validate,
}: {
  accent: string;
  premium: PremiumLicense | null;
  onUnlock: (buyerId: string, code: string) => boolean;
  onReset: () => void;
  validate: (buyerId: string, code: string) => PremiumLicense | null;
}) {
  const [buyerId, setBuyerId] = useState("");
  const [code, setCode] = useState("");
  const [shake, setShake] = useState(false);

  const tryUnlock = () => {
    const valid = validate(buyerId.trim(), code.trim());
    if (!valid) {
      setShake(true);
      window.setTimeout(() => setShake(false), 500);
      toast("Invalid ID or PASS", "🚫");
      return;
    }
    onUnlock(buyerId.trim(), code.trim());
    confetti(180, [accent, "#ffffff", "#ffc247"]);
    toast("App unlocked", "🔓");
  };

  return (
    <div className="h-full w-full overflow-y-auto app-scroll no-scrollbar px-4 pb-10 pt-2">
      <div className="mx-auto flex min-h-full w-full max-w-[560px] flex-col justify-center">
        <header className="px-1 pt-4 text-center">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
            style={{ borderColor: hexToRgba(accent, 0.45), background: hexToRgba(accent, 0.12), color: accent }}
          >
            <span className="text-sm">🔒</span>
            Secure login
          </div>
          <h1 className="mt-4 text-[30px] font-bold leading-tight">Momentum</h1>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Enter your ID and PASS to continue.
          </p>
        </header>

        <Card
          className={cn("anim-fade-up mt-6 !p-5", shake && "wiggle")}
          style={{ borderColor: hexToRgba(accent, 0.32) }}
        >
          <div className="mb-4 text-center">
            <div
              className="mx-auto grid h-14 w-14 place-items-center rounded-2xl text-2xl"
              style={{ background: hexToRgba(accent, 0.14) }}
            >
              🔑
            </div>
            <h2 className="mt-3 text-lg font-bold">Enter your credentials</h2>
          </div>
          <div className="grid gap-3">
            <input
              value={buyerId}
              onChange={(e) => setBuyerId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
              autoComplete="username"
              placeholder="ID"
              aria-label="ID"
              className="h-12 rounded-2xl border px-4 text-[15px] outline-none"
              style={{ background: "var(--surface-2)", borderColor: "var(--line)", color: "var(--text)" }}
            />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
              autoComplete="current-password"
              placeholder="PASS"
              aria-label="PASS"
              type="password"
              className="h-12 rounded-2xl border px-4 text-[15px] outline-none"
              style={{ background: "var(--surface-2)", borderColor: "var(--line)", color: "var(--text)" }}
            />
            <button
              onClick={tryUnlock}
              className="press mt-1 rounded-full px-5 py-3 text-sm font-semibold text-white"
              style={{ background: accent }}
            >
              Unlock
            </button>
          </div>
        </Card>

        {premium && (
          <Card className="mt-4 !py-4">
            <p className="text-sm font-semibold">
              {premiumActive(premium) ? "Access active" : "Access expired"}
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              {formatExpiry(premium)}
            </p>
            <button
              onClick={onReset}
              className="press mt-3 rounded-full border px-4 py-2 text-xs font-semibold"
              style={{ borderColor: "var(--line)" }}
            >
              Reset saved login
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}
