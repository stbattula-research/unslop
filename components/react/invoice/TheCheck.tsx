import * as React from "react";
import { cn } from "../lib/utils";

/**
 * The Check — an invoice/receipt staged as a restaurant check.
 * Every charge is a line on the check with a plain-English reason
 * for being there; credits are their own lines, never silently
 * netted; tax is its own line with its rate; and the total is the
 * sum of the lines above it — add it up yourself, it reconciles.
 * A PAID / DUE / OVERDUE stamp says the state out loud, and the
 * small print says what to do when a line doesn't make sense.
 * Flat check paper/ink, static. A check is printed, so it stays
 * on paper in both modes, by genre.
 */

export interface InvoiceLine {
  /** e.g. "Pro plan — 3 seats" */
  description: string;
  /** one plain sentence saying what this charge is for, e.g. "Three seats on the Pro plan, Nov 1 – Nov 30." */
  detail?: string;
  /** e.g. 3 — shown as "3 × $24.00" when unitPrice is set */
  qty?: number;
  /** unit price in dollars, e.g. 24 */
  unitPrice?: number;
  /** signed line amount in dollars; credits and discounts are negative */
  amount: number;
  /** a credit or discount prints with a minus and a different label color */
  kind?: "charge" | "credit" | "discount";
}

export interface TheCheckProps {
  kicker?: string;
  heading?: string;
  standfirst?: string;
  /** who is billing, e.g. "Unslop Studio" */
  merchant?: string;
  /** e.g. "12 Paper Street, Austin TX 78701" */
  merchantAddress?: string;
  /** e.g. "INV-2026-1147" */
  invoiceNumber?: string;
  /** e.g. "2026-11-19" */
  issuedDate?: string;
  /** e.g. "2026-12-03" */
  dueDate?: string;
  /** the period this check covers, e.g. "Nov 1 – Nov 30, 2026" */
  period?: string;
  /** who is being billed, e.g. "Sai Teja Battula" */
  billedToName?: string;
  /** e.g. "stbattula@gmail.com" */
  billedToDetail?: string;
  lines?: InvoiceLine[];
  /** e.g. "Sales tax (TX 8.25%)" */
  taxLabel?: string;
  /** tax amount in dollars, e.g. 5.3 */
  taxAmount?: number;
  /** the state of the check, stamped on it */
  status?: "paid" | "due" | "overdue";
  /** e.g. "Visa •••• 4242" — shown on the tear-off stub when paid */
  paymentMethod?: string;
  /** amount already paid in dollars; balance due is total minus this */
  paidAmount?: number;
  /** one line naming what changed since the last check, e.g. "One seat added Nov 12 (+$24)." */
  changesNote?: string;
  /** where the PDF lives, e.g. "/invoices/INV-2026-1147.pdf" */
  downloadHref?: string;
  /** where to ask about a line, e.g. "/support/billing" */
  supportHref?: string;
  footnote?: string;
  className?: string;
}

const DEFAULT_LINES: InvoiceLine[] = [
  {
    description: "Pro plan — 3 seats",
    detail: "Three seats on the Pro plan, Nov 1 – Nov 30.",
    qty: 3,
    unitPrice: 24,
    amount: 72,
  },
  {
    description: "Extra builds — 204 over the limit",
    detail: "204 builds past the 1,000 included in Pro, at 5¢ each.",
    qty: 204,
    unitPrice: 0.05,
    amount: 10.2,
  },
  {
    description: "Annual prepay credit",
    detail: "You paid a year up front in January; this month's share of that credit.",
    amount: -18,
    kind: "credit",
  },
];

function fmt(n: number): string {
  const sign = n < 0 ? "−" : "";
  return `${sign}$${Math.abs(n).toFixed(2)}`;
}

export function TheCheck({
  kicker = "Billing · one check, every line named",
  heading = "Here is what you were charged, and why.",
  standfirst = "No 'miscellaneous', no service fee with no explanation. Every line says what it is for, credits are printed as their own lines instead of quietly netted, and the total is the sum of the lines above it — add it up yourself.",
  merchant = "Unslop Studio",
  merchantAddress = "12 Paper Street, Austin TX 78701",
  invoiceNumber = "INV-2026-1147",
  issuedDate = "2026-11-19",
  dueDate = "2026-12-03",
  period = "Nov 1 – Nov 30, 2026",
  billedToName = "Sai Teja Battula",
  billedToDetail = "stbattula@gmail.com",
  lines = DEFAULT_LINES,
  taxLabel = "Sales tax (TX 8.25%)",
  taxAmount = 5.3,
  status = "paid",
  paymentMethod = "Visa •••• 4242",
  paidAmount = 69.5,
  changesNote = "What changed since last month: one seat added on Nov 12 (+$24), and the annual-prepay credit is $2 smaller because the plan price rose in October — that rise is on the October check, not hidden here.",
  downloadHref = "/invoices/INV-2026-1147.pdf",
  supportHref = "/support/billing",
  footnote,
  className,
}: TheCheckProps) {
  const subtotal = lines.reduce((sum, line) => sum + line.amount, 0);
  const total = subtotal + taxAmount;
  const balance = total - paidAmount;
  const stamp =
    status === "paid" ? "PAID" : status === "overdue" ? "OVERDUE" : "DUE";

  return (
    <section
      className={cn("bg-[#f7f1de] text-stone-950", className)}
      role="region"
      aria-label="Invoice"
    >
      <div className="mx-auto max-w-2xl px-5 py-8 md:px-8 md:py-10">
        {/* Check header */}
        <div className="min-w-0 border-b-4 border-double border-stone-950 pb-5">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-red-900">
            {kicker}
          </p>
          <h2 className="mt-2 break-words font-serif text-3xl font-black tracking-tight md:text-4xl">
            {heading}
          </h2>
          <p className="mt-2 max-w-xl break-words font-serif text-base italic leading-relaxed text-stone-700">
            {standfirst}
          </p>
          <p className="mt-3 flex min-w-0 flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">
            <span>{merchant}</span>
            <span className="min-w-0 break-words font-normal normal-case tracking-normal">
              {merchantAddress}
            </span>
          </p>
        </div>

        {/* The check */}
        <div className="relative mt-6 border-2 border-stone-950 bg-[#fbf7ea] px-5 py-5 shadow-[6px_6px_0_0_#1c1917]">
          <p className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <span className="shrink-0 font-mono text-[11px] font-black uppercase tracking-[0.2em] text-stone-500">
              Check {invoiceNumber}
            </span>
            <span className="shrink-0 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">
              {period}
            </span>
          </p>
          <p className="mt-3 flex min-w-0 flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-stone-700">
            <span>
              Issued <strong className="text-stone-950">{issuedDate}</strong>
            </span>
            <span>
              Due <strong className="text-stone-950">{dueDate}</strong>
            </span>
            <span>
              Billed to{" "}
              <strong className="text-stone-950">{billedToName}</strong>
            </span>
            <span className="min-w-0 break-words">{billedToDetail}</span>
          </p>

          {/* The stamp */}
          <p
            aria-label={`Status: ${stamp}`}
            className="pointer-events-none absolute right-4 top-16 rotate-[-8deg] select-none border-[3px] border-red-900 px-3 py-1 font-mono text-lg font-black uppercase tracking-[0.25em] text-red-900 opacity-80 md:right-6"
          >
            {stamp}
          </p>

          {/* Line items */}
          <ul className="mt-5 border-t-2 border-stone-950">
            {lines.map((line) => (
              <li
                key={line.description}
                className="border-b border-dashed border-stone-950/30 py-4"
              >
                <p className="flex min-w-0 items-baseline justify-between gap-x-4">
                  <span className="min-w-0 flex-1 break-words font-serif text-lg font-black leading-snug">
                    {line.description}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 font-mono text-sm font-bold tabular-nums",
                      line.kind && line.kind !== "charge"
                        ? "text-red-900"
                        : "text-stone-950",
                    )}
                  >
                    {line.kind === "credit"
                      ? "credit "
                      : line.kind === "discount"
                        ? "discount "
                        : ""}
                    {fmt(line.amount)}
                  </span>
                </p>
                {line.detail && (
                  <p className="mt-1 break-words font-serif text-sm italic leading-relaxed text-stone-700">
                    {line.detail}
                  </p>
                )}
                {line.qty !== undefined && line.unitPrice !== undefined && (
                  <p className="mt-1 font-mono text-xs text-stone-500">
                    {line.qty} × {fmt(line.unitPrice)}
                  </p>
                )}
              </li>
            ))}
          </ul>

          {/* Totals — computed from the lines above, never typed in */}
          <div className="mt-4 space-y-1.5 font-mono text-sm">
            <p className="flex min-w-0 justify-between gap-x-4">
              <span className="min-w-0 break-words text-stone-700">
                Subtotal — the lines above, added up
              </span>
              <span className="shrink-0 font-bold tabular-nums">
                {fmt(subtotal)}
              </span>
            </p>
            <p className="flex min-w-0 justify-between gap-x-4">
              <span className="min-w-0 break-words text-stone-700">
                {taxLabel}
              </span>
              <span className="shrink-0 font-bold tabular-nums">
                {fmt(taxAmount)}
              </span>
            </p>
            <p className="flex min-w-0 items-baseline justify-between gap-x-4 border-t-2 border-stone-950 pt-3">
              <span className="min-w-0 break-words font-bold uppercase tracking-[0.15em]">
                Total due
              </span>
              <span className="shrink-0 font-serif text-3xl font-black tabular-nums">
                {fmt(total)}
              </span>
            </p>
            <p className="flex min-w-0 justify-between gap-x-4">
              <span className="min-w-0 break-words text-stone-700">
                Paid {paymentMethod ? `(${paymentMethod})` : ""}
              </span>
              <span className="shrink-0 font-bold tabular-nums">
                {fmt(paidAmount)}
              </span>
            </p>
            <p className="flex min-w-0 justify-between gap-x-4">
              <span className="min-w-0 break-words font-bold uppercase tracking-[0.15em]">
                Balance due
              </span>
              <span className="shrink-0 font-bold tabular-nums">
                {fmt(balance)}
              </span>
            </p>
          </div>

          {changesNote && (
            <p className="mt-5 break-words border border-dashed border-stone-950/40 px-4 py-3 font-serif text-sm italic leading-relaxed text-stone-700">
              {changesNote}
            </p>
          )}

          <p className="mt-5 flex min-w-0 flex-wrap gap-x-6 gap-y-2 font-mono text-xs font-bold uppercase tracking-[0.15em]">
            <a
              href={downloadHref}
              className="shrink-0 text-red-900 underline underline-offset-4"
            >
              Download PDF
            </a>
            <a
              href={supportHref}
              className="shrink-0 text-red-900 underline underline-offset-4"
            >
              Ask about a line
            </a>
          </p>
        </div>

        {/* Tear-off stub */}
        <div className="mt-6 border-t-2 border-dashed border-stone-950/40 pt-4">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-stone-500">
            Keep this stub
          </p>
          <p className="mt-2 flex min-w-0 flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-stone-700">
            <span>
              Check <strong className="text-stone-950">{invoiceNumber}</strong>
            </span>
            <span>
              Total <strong className="text-stone-950">{fmt(total)}</strong>
            </span>
            <span>
              Paid{" "}
              <strong className="text-stone-950">
                {fmt(paidAmount)}
                {paymentMethod ? ` · ${paymentMethod}` : ""}
              </strong>
            </span>
            <span>
              Balance{" "}
              <strong className="text-stone-950">{fmt(balance)}</strong>
            </span>
          </p>
        </div>

        <p className="mt-8 font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-stone-500">
          If a line on this check doesn&apos;t make sense to you, the line is
          wrong, not you — write to us and we&apos;ll explain it or take it
          off. The amounts above are samples — replace them with your real
          invoice; a total that doesn&apos;t add up from its own lines should
          never ship.
        </p>
        {footnote && (
          <p className="mt-3 font-serif text-sm italic text-stone-700">{footnote}</p>
        )}
      </div>
    </section>
  );
}
