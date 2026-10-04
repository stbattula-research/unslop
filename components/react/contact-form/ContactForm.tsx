import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Letter — a contact form written as correspondence.
 * Salutation, ruled lines, a sign-off submit. Serif throughout.
 * Uses system font stacks only.
 */

export interface ContactFormProps {
  heading?: string;
  salutation?: string;
  signoff?: string;
  submitLabel?: string;
  onSubmit?: (data: { name: string; email: string; message: string }) => void;
  className?: string;
}

export function ContactForm({
  heading,
  salutation = "Dear us,",
  signoff = "Yours,",
  submitLabel = "Send the letter",
  onSubmit,
  className,
}: ContactFormProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [sent, setSent] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.({ name, email, message });
    setSent(true);
  }

  const fieldClass =
    "w-full border-b-2 border-stone-950/30 bg-transparent pb-2 font-serif text-lg italic placeholder:text-stone-400 focus:border-amber-700 focus:outline-none dark:border-stone-50/30 dark:placeholder:text-stone-500";
  const labelClass =
    "mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400";

  return (
    <section className={cn("w-full bg-[#faf7f0] text-stone-950 dark:bg-stone-950 dark:text-stone-50", className)}>
      <div className="mx-auto max-w-2xl px-6 py-20 md:py-24">
        {heading && (
          <h2 className="mb-10 font-serif text-4xl font-black tracking-tight md:text-5xl">
            {heading}
          </h2>
        )}

        {sent ? (
          <div className="border-2 border-stone-950 bg-amber-100 p-10 text-center dark:border-stone-50 dark:bg-stone-900">
            <p className="font-serif text-2xl italic">Sealed with wax and on its way.</p>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-stone-500">
              We&rsquo;ll write back soon.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="border-2 border-stone-950/20 bg-white/60 p-8 shadow-[8px_8px_0_0_rgba(28,25,23,0.08)] md:p-12 dark:border-stone-50/20 dark:bg-stone-900/60"
          >
            <p className="font-serif text-2xl italic">{salutation}</p>

            <div className="mt-8 space-y-8">
              <div>
                <label htmlFor="unslop-name" className={labelClass}>
                  Your name
                </label>
                <input
                  id="unslop-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Appleseed"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="unslop-email" className={labelClass}>
                  Where we may reply
                </label>
                <input
                  id="unslop-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="unslop-message" className={labelClass}>
                  The body of the letter
                </label>
                <textarea
                  id="unslop-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="It began on a Tuesday…"
                  className={cn(fieldClass, "resize-y leading-relaxed")}
                />
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between gap-6">
              <p className="font-serif text-xl italic text-stone-500 dark:text-stone-400">
                {signoff}
              </p>
              <button
                type="submit"
                className="cursor-pointer border-2 border-stone-950 bg-stone-950 px-6 py-3 font-mono text-sm font-bold uppercase tracking-[0.14em] text-stone-50 shadow-[4px_4px_0_0_#b45309] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#b45309] dark:border-stone-50 dark:bg-stone-50 dark:text-stone-950"
              >
                {submitLabel} →
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
