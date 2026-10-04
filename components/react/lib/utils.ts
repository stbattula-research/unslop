/**
 * Tiny classNames joiner — no dependencies.
 * Unslop components use Tailwind utilities only.
 */
export function cn(
  ...inputs: Array<string | false | null | undefined>
): string {
  return inputs.filter(Boolean).join(" ");
}
