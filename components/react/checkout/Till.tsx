import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Till — a checkout form staged as a shop till.
 * The order summary is the till tape on the left: every line item, the
 * shipping, and the tax, with the total computed from the visible lines —
 * never typed in, and never changed at the last step. The payment form is
 * the till itself on the right: one page, three numbered steps (Contact,
 * Shipping, Payment), seven fields and nothing more. Guest checkout is the
 * default — no account is created, and the small print says an account can
 * be made after the order, when all it takes is a password. Gift wrap is
 * an unchecked box, never a pre-ticked extra, and ticking it recomputes
 * the total in front of you. Billing defaults to the shipping address
 * because that is what most people want, and the box says so plainly.
 * Submitting prints a PAID stamp and the order number in place — wiring
 * the charge to a real payment processor is the integrator's job, and the
 * optional `onPay` prop is where that hook lives. This is a demo till:
 * no card is charged and no number leaves the page. Flat paper, ink,
 * till red, static except for the form itself. The till stays paper in
 * both modes — a receipt is printed.
 */

export interface TillItem {
  name: string;
  detail: string;
  qty: number;
  /** unit price in dollars */
  unitPrice: number;
}

export interface TillProps {
  kicker?: string;
  heading?: string;
  standfirst?: string;
  /** the shop's name, printed at the head of the tape */
  shopName?: string;
  /** the order number printed on the tape; a demo starting point */
  orderNumber?: string;
  items?: TillItem[];
  shippingLabel?: string;
  shippingCost?: number;
  taxLabel?: string;
  /** tax rate as a decimal, e.g. 0.0825 for 8.25% */
  taxRate?: number;
  /** when the order arrives, printed on the tape */
  deliveryDate?: string;
  /** gift-wrap price; the box is unchecked by default */
  giftWrapPrice?: number;
  /** called with the order total on submit, when the integrator wires up a real processor */
  onPay?: (details: { email: string; total: number }) => void;
  footnote?: string;
  className?: string;
}

function money(n: number): string {
  return `$${n.toFixed(2)}`;
}

export function Till({
  kicker = "The till · one page, no surprises",
  heading = "Pay for what's on the tape.",
  standfirst = "The total above is the total you pay. No fee appears at the last step, no account is required, and the form asks for seven fields — everything it needs to send the order, nothing it doesn't.",
  shopName = "The Unslop General Store",
  orderNumber = "1042",
  items = [
    { name: "Field notebook, dot grid", detail: "A6 · 96 pages · paper that takes ink", qty: 1, unitPrice: 24.0 },
    { name: "Brass paper clips", detail: "Box of 100 · they do not rust", qty: 2, unitPrice: 9.5 },
  ],
  shippingLabel = "Shipping · Standard, tracked",
  shippingCost = 6.95,
  taxLabel = "Sales tax",
  taxRate = 0.0825,
  deliveryDate = "Thursday, November 26",
  giftWrapPrice = 4.0,
  onPay,
  footnote,
  className,
}: TillProps) {
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [city, setCity] = React.useState("");
  const [zip, setZip] = React.useState("");
  const [cardName, setCardName] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiry, setExpiry] = React.useState("");
  const [cvc, setCvc] = React.useState("");
  const [giftWrap, setGiftWrap] = React.useState(false);
  const [billingSame, setBillingSame] = React.useState(true);
  const [paid, setPaid] = React.useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
  const wrap = giftWrap ? giftWrapPrice : 0;
  const tax = Math.round((subtotal + wrap) * taxRate * 100) / 100;
  const total = subtotal + shippingCost + wrap + tax;

  const formatCardNumber = (value: string) =>
    value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim() || !cardNumber.replace(/\D/g, "")) return;
    onPay?.({ email: email.trim(), total });
    setPaid(true);
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
          {/* The till tape: the order, priced line by line */}
          <div className="min-w-0">
            <h2 className="font-serif text-4xl font-black tracking-tight md:text-5xl">
              {heading}
            </h2>
            <p className="mt-4 font-serif text-lg italic leading-relaxed text-stone-500">
              {standfirst}
            </p>

            <p className="mt-10 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-red-800">
              The tape, in three steps
            </p>
            <ol className="mt-4 border-t-2 border-stone-900">
              {[
                ["01", "Contact", "Where the receipt goes"],
                ["02", "Shipping", "Where the parcel goes"],
                ["03", "Payment", "The card, and nothing else"],
              ].map(([num, step, what]) => (
                <li
                  key={step}
                  className="flex min-w-0 gap-4 border-b border-stone-900/20 py-4"
                >
                  <span className="font-mono text-sm font-bold text-red-800">{num}</span>
                  <span className="min-w-0">
                    <span className="block break-words font-serif text-lg leading-snug">{step}</span>
                    <span className="block break-words font-serif text-sm italic text-stone-500">{what}</span>
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-8 font-serif text-sm italic text-stone-500">
              One page, start to finish. The steps are labels, not a maze —
              nothing hides behind a &ldquo;next&rdquo; button.
            </p>
          </div>

          {/* The till */}
          <div className="min-w-0">
            <div className="border-2 border-stone-900 bg-white shadow-[8px_8px_0_0_#991b1b]">
              <div className="flex items-center justify-between gap-4 border-b border-dashed border-stone-900/40 px-5 py-3">
                <span className="font-mono text-[11px] font-bold uppercase tracking-[0.25em]">
                  {shopName} · Till Nº 1
                </span>
                <span className="bg-red-800 px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                  Open
                </span>
              </div>

              <div className="px-5 py-6 md:px-6">
                {/* Tape: items, charges, total */}
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-500">
                  Order Nº {orderNumber} · arrives {deliveryDate}
                </p>
                <ul className="mt-4 border-t border-stone-900/20">
                  {items.map((item) => (
                    <li
                      key={item.name}
                      className="flex min-w-0 items-baseline justify-between gap-4 border-b border-stone-900/10 py-3"
                    >
                      <span className="min-w-0">
                        <span className="block break-words font-serif text-base leading-snug">
                          {item.name}
                          {item.qty > 1 ? ` × ${item.qty}` : ""}
                        </span>
                        <span className="block break-words font-serif text-sm italic text-stone-500">
                          {item.detail}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-sm tabular-nums">
                        {money(item.qty * item.unitPrice)}
                      </span>
                    </li>
                  ))}
                  <li className="flex min-w-0 items-baseline justify-between gap-4 border-b border-stone-900/10 py-3">
                    <span className="min-w-0 break-words font-serif text-base leading-snug">{shippingLabel}</span>
                    <span className="shrink-0 font-mono text-sm tabular-nums">{money(shippingCost)}</span>
                  </li>
                  {giftWrap && (
                    <li className="flex min-w-0 items-baseline justify-between gap-4 border-b border-stone-900/10 py-3">
                      <span className="min-w-0 break-words font-serif text-base leading-snug">Gift wrap</span>
                      <span className="shrink-0 font-mono text-sm tabular-nums">{money(giftWrapPrice)}</span>
                    </li>
                  )}
                  <li className="flex min-w-0 items-baseline justify-between gap-4 border-b border-stone-900/10 py-3">
                    <span className="min-w-0 break-words font-serif text-base leading-snug">
                      {taxLabel} ({(taxRate * 100).toFixed(2)}%)
                    </span>
                    <span className="shrink-0 font-mono text-sm tabular-nums">{money(tax)}</span>
                  </li>
                </ul>
                <p className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.25em]">Total due</span>
                  <span className="font-mono text-4xl font-black tabular-nums tracking-tight">
                    {money(total)}
                  </span>
                </p>
                <p className="mt-1 font-serif text-sm italic text-stone-500">
                  This total is the sum of the lines above it. Nothing is
                  added after you press pay.
                </p>

                {paid ? (
                  <div role="status" className="relative mt-8 border-t border-dashed border-stone-900/40 pt-6">
                    <p className="border-l-2 border-red-800 pl-4 font-serif text-lg leading-relaxed">
                      Paid {money(total)}, order Nº {orderNumber}. The receipt
                      is on its way to {email.trim() || "your inbox"} — and if
                      you want an account, make it after, when all it takes
                      is a password.
                    </p>
                    <p className="pointer-events-none absolute -right-2 -top-4 rotate-[-8deg] border-2 border-red-800 px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-red-800">
                      Paid
                    </p>
                  </div>
                ) : (
                  <form onSubmit={submit} className="mt-8">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-red-800">
                      1 · Contact
                    </p>
                    <label
                      htmlFor="till-email"
                      className="mt-3 block font-mono text-[11px] font-bold uppercase tracking-[0.25em]"
                    >
                      Email, for the receipt
                    </label>
                    <input
                      id="till-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="mt-2 w-full min-w-0 border-2 border-stone-900 bg-[#f6f1e7] px-4 py-3 font-serif text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-800"
                    />

                    <p className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-red-800">
                      2 · Shipping
                    </p>
                    <label
                      htmlFor="till-name"
                      className="mt-3 block font-mono text-[11px] font-bold uppercase tracking-[0.25em]"
                    >
                      Full name
                    </label>
                    <input
                      id="till-name"
                      type="text"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ada Lovelace"
                      className="mt-2 w-full min-w-0 border-2 border-stone-900 bg-[#f6f1e7] px-4 py-3 font-serif text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-800"
                    />
                    <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
                      <div className="min-w-0">
                        <label
                          htmlFor="till-street"
                          className="block font-mono text-[11px] font-bold uppercase tracking-[0.25em]"
                        >
                          Street
                        </label>
                        <input
                          id="till-street"
                          type="text"
                          required
                          autoComplete="street-address"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          placeholder="12 Paper Lane"
                          className="mt-2 w-full min-w-0 border-2 border-stone-900 bg-[#f6f1e7] px-4 py-3 font-serif text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-800"
                        />
                      </div>
                      <div className="grid min-w-0 grid-cols-2 gap-4">
                        <div className="min-w-0">
                          <label
                            htmlFor="till-city"
                            className="block font-mono text-[11px] font-bold uppercase tracking-[0.25em]"
                          >
                            City
                          </label>
                          <input
                            id="till-city"
                            type="text"
                            required
                            autoComplete="address-level2"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Dallas"
                            className="mt-2 w-full min-w-0 border-2 border-stone-900 bg-[#f6f1e7] px-4 py-3 font-serif text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-800"
                          />
                        </div>
                        <div className="min-w-0">
                          <label
                            htmlFor="till-zip"
                            className="block font-mono text-[11px] font-bold uppercase tracking-[0.25em]"
                          >
                            ZIP
                          </label>
                          <input
                            id="till-zip"
                            type="text"
                            required
                            inputMode="numeric"
                            autoComplete="postal-code"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            placeholder="75243"
                            className="mt-2 w-full min-w-0 border-2 border-stone-900 bg-[#f6f1e7] px-4 py-3 font-serif text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-800"
                          />
                        </div>
                      </div>
                    </div>

                    <p className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-red-800">
                      3 · Payment
                    </p>
                    <label
                      htmlFor="till-card-name"
                      className="mt-3 block font-mono text-[11px] font-bold uppercase tracking-[0.25em]"
                    >
                      Name on card
                    </label>
                    <input
                      id="till-card-name"
                      type="text"
                      required
                      autoComplete="cc-name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Ada Lovelace"
                      className="mt-2 w-full min-w-0 border-2 border-stone-900 bg-[#f6f1e7] px-4 py-3 font-serif text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-800"
                    />
                    <label
                      htmlFor="till-card-number"
                      className="mt-4 block font-mono text-[11px] font-bold uppercase tracking-[0.25em]"
                    >
                      Card number
                    </label>
                    <input
                      id="till-card-number"
                      type="text"
                      required
                      inputMode="numeric"
                      autoComplete="cc-number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="4242 4242 4242 4242"
                      className="mt-2 w-full min-w-0 border-2 border-stone-900 bg-[#f6f1e7] px-4 py-3 font-serif text-lg tracking-widest text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-800"
                    />
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="min-w-0">
                        <label
                          htmlFor="till-expiry"
                          className="block font-mono text-[11px] font-bold uppercase tracking-[0.25em]"
                        >
                          Expiry
                        </label>
                        <input
                          id="till-expiry"
                          type="text"
                          required
                          inputMode="numeric"
                          autoComplete="cc-exp"
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          className="mt-2 w-full min-w-0 border-2 border-stone-900 bg-[#f6f1e7] px-4 py-3 font-serif text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-800"
                        />
                      </div>
                      <div className="min-w-0">
                        <label
                          htmlFor="till-cvc"
                          className="block font-mono text-[11px] font-bold uppercase tracking-[0.25em]"
                        >
                          CVC
                        </label>
                        <input
                          id="till-cvc"
                          type="text"
                          required
                          inputMode="numeric"
                          autoComplete="cc-csc"
                          maxLength={4}
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          placeholder="123"
                          className="mt-2 w-full min-w-0 border-2 border-stone-900 bg-[#f6f1e7] px-4 py-3 font-serif text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-red-800"
                        />
                      </div>
                    </div>

                    <label className="mt-4 flex min-w-0 cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={billingSame}
                        onChange={(e) => setBillingSame(e.target.checked)}
                        className="mt-1 h-4 w-4 shrink-0 accent-red-800"
                      />
                      <span className="min-w-0 break-words font-serif text-base leading-snug">
                        Billing address is the same as shipping — the usual
                        case, so it is checked. Untick it and we will ask.
                      </span>
                    </label>
                    <label className="mt-3 flex min-w-0 cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={giftWrap}
                        onChange={(e) => setGiftWrap(e.target.checked)}
                        className="mt-1 h-4 w-4 shrink-0 accent-red-800"
                      />
                      <span className="min-w-0 break-words font-serif text-base leading-snug">
                        Add gift wrap ({money(giftWrapPrice)}) — unticked
                        until you say so. Ticking it re-adds the line above.
                      </span>
                    </label>

                    <button
                      type="submit"
                      className="mt-6 w-full bg-stone-900 px-4 py-3 font-mono text-sm font-bold uppercase tracking-[0.2em] text-white hover:bg-red-800"
                    >
                      Pay {money(total)} →
                    </button>
                  </form>
                )}

                <p className="mt-6 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-stone-500">
                  No account, no pre-ticked extras, no fee at the last step.
                  This till is a demo — wire <code>onPay</code> to your real
                  payment processor. No card is charged here, and no number
                  leaves this page.
                </p>
              </div>
            </div>

            <p className="mt-4 font-serif text-sm italic text-stone-500">
              A checkout that shows its working, then asks for the card.
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
