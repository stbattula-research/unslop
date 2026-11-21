import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Guest Book — a sign-up / sign-in form staged as a hotel guest register.
 * The pitch is the innkeeper's welcome on the left ("what a room gets you").
 * The form itself is the register book on the right: ruled ledger lines,
 * three fields and nothing more, a mono room number, and a rotated CHECKED IN
 * stamp once the name is written in. A "Returning guest?" toggle switches the
 * book from sign-up (name, email, password) to sign-in (email, password).
 * Submitting writes the guest in place — wiring the account to a real backend
 * is the integrator's job, and the optional `onSignUp` prop is where that
 * hook lives. No phone number harvested, no company-size question, no
 * pre-ticked marketing box, no "sign in with Google" button that hands the
 * guest to a third party: three fields is all a sign-up needs, and the small
 * print says so. Flat paper, ink, register green, static except for the form
 * itself. The register stays paper in both modes — a guest book is printed.
 */

export interface GuestBookProps {
  kicker?: string;
  heading?: string;
  standfirst?: string;
  /** the inn's name, printed at the head of the register */
  innName?: string;
  /** "what a room gets you" — the house lines beside the register */
  houseLines?: string[];
  /** the room number printed on the register; a demo starting point */
  startingRoom?: number;
  /** called with the guest's details on submit, when the integrator wires up a real backend */
  onSignUp?: (details: { name: string; email: string }) => void;
  footnote?: string;
  className?: string;
}

export function GuestBook({
  kicker = "The guest book · rooms from check-in",
  heading = "Sign the register.",
  standfirst = "Three lines, that's all. A name, an email, and a password — and the room is yours. We don't ask for your phone number, your company, or your life story at the door.",
  innName = "The Unslop Inn",
  houseLines = [
    "A room of your own, not a tracking pixel",
    "One key, handed over at the desk — never emailed around",
    "Leave whenever you like. The door locks from the inside",
  ],
  startingRoom = 214,
  onSignUp,
  footnote,
  className,
}: GuestBookProps) {
  const [mode, setMode] = React.useState<"signup" | "signin">("signup");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [signed, setSigned] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (mode === "signup" && !name.trim()) return;
    onSignUp?.({ name: name.trim(), email: email.trim() });
    setSigned(true);
  };

  const switchMode = (next: "signup" | "signin") => {
    setMode(next);
    setSigned(false);
  };

  return (
    <section
      className={cn(
        "w-full bg-[#f6f1e7] text-stone-900",
        className
      )}
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <p className="border-y border-stone-900/20 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.3em]">
          {kicker}
        </p>

        <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
          {/* The innkeeper's welcome: what a room gets you */}
          <div className="min-w-0">
            <h2 className="font-serif text-4xl font-black tracking-tight md:text-5xl">
              {heading}
            </h2>
            <p className="mt-4 font-serif text-lg italic leading-relaxed text-stone-500">
              {standfirst}
            </p>

            <p className="mt-10 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-green-800">
              The house, in three lines
            </p>
            <ul className="mt-4 border-t-2 border-stone-900">
              {houseLines.map((line, i) => (
                <li
                  key={line}
                  className="flex min-w-0 gap-4 border-b border-stone-900/20 py-4"
                >
                  <span className="font-mono text-sm font-bold text-green-800">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 break-words font-serif text-lg leading-snug">
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* The register book */}
          <div className="min-w-0">
            <div className="border-2 border-stone-900 bg-white shadow-[8px_8px_0_0_#166534]">
              <div className="flex items-center justify-between gap-4 border-b border-dashed border-stone-900/40 px-5 py-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em]">
                  {innName} · Guest register
                </span>
                <span className="bg-green-800 px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  Desk open
                </span>
              </div>

              <div className="px-5 py-6 md:px-6">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-500">
                  {mode === "signup" ? "Your room" : "Your room, again"}
                </p>
                <p className="mt-1 font-mono text-6xl font-black tabular-nums tracking-tight md:text-7xl">
                  Nº {String(startingRoom).padStart(3, "0")}
                </p>

                {signed ? (
                  <div role="status" className="relative mt-6">
                    <p className="border-l-2 border-green-800 pl-4 font-serif text-lg leading-relaxed">
                      {mode === "signup"
                        ? `Room Nº ${String(startingRoom).padStart(3, "0")} is yours${
                            name.trim() ? `, ${name.trim()}` : ""
                          }. The key is at the desk — and the register never leaves the building.`
                        : `Welcome back${
                            name.trim() ? `, ${name.trim()}` : ""
                          }. Room Nº ${String(startingRoom).padStart(
                            3,
                            "0"
                          )} is yours again — the key is at the desk.`}
                    </p>
                    <p className="pointer-events-none absolute -right-2 -top-6 rotate-[-8deg] border-2 border-green-800 px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-green-800">
                      Checked in
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="mt-6">
                    {mode === "signup" && (
                      <>
                        <label
                          htmlFor="guest-book-name"
                          className="font-mono text-[11px] font-bold uppercase tracking-[0.25em]"
                        >
                          Name, as it goes in the book
                        </label>
                        <input
                          id="guest-book-name"
                          type="text"
                          required
                          autoComplete="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ada Lovelace"
                          className="mt-2 w-full min-w-0 border-2 border-stone-900 bg-[#f6f1e7] px-4 py-3 font-serif text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-green-800"
                        />
                      </>
                    )}
                    <label
                      htmlFor="guest-book-email"
                      className="mt-4 block font-mono text-[11px] font-bold uppercase tracking-[0.25em]"
                    >
                      Email, for the key
                    </label>
                    <input
                      id="guest-book-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-2 w-full min-w-0 border-2 border-stone-900 bg-[#f6f1e7] px-4 py-3 font-serif text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-green-800"
                    />
                    <label
                      htmlFor="guest-book-password"
                      className="mt-4 block font-mono text-[11px] font-bold uppercase tracking-[0.25em]"
                    >
                      Password — eight characters, that&apos;s the whole rule
                    </label>
                    <div className="mt-2 flex min-w-0 gap-2">
                      <input
                        id="guest-book-password"
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        autoComplete={
                          mode === "signup" ? "new-password" : "current-password"
                        }
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full min-w-0 flex-1 border-2 border-stone-900 bg-[#f6f1e7] px-4 py-3 font-serif text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-green-800"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-pressed={showPassword}
                        className="shrink-0 border-2 border-stone-900 px-3 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-stone-900 hover:text-white"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <button
                      type="submit"
                      className="mt-4 w-full bg-stone-900 px-4 py-3 font-mono text-sm font-bold uppercase tracking-[0.2em] text-white hover:bg-green-800"
                    >
                      {mode === "signup" ? "Sign the register →" : "Take the key →"}
                    </button>
                  </form>
                )}

                <p className="mt-6 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-stone-500">
                  Three fields, no pre-ticked boxes, no social sign-in that
                  hands you to a third party. This register is a demo — wire{" "}
                  <code>onSignUp</code> to your real backend.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    switchMode(mode === "signup" ? "signin" : "signup")
                  }
                  className="mt-4 font-serif text-sm italic text-green-800 underline underline-offset-4"
                >
                  {mode === "signup"
                    ? "Already a guest? Sign in instead."
                    : "New here? Sign the register instead."}
                </button>
              </div>
            </div>

            <p className="mt-4 font-serif text-sm italic text-stone-500">
              A sign-up that asks for what it needs, and nothing it
              doesn&apos;t.
            </p>
          </div>
        </div>

        {footnote && (
          <p className="mx-auto mt-12 max-w-xl text-center font-serif text-sm italic text-stone-500">
            {footnote}
          </p>
        )}
      </div>
    </section>
  );
}
