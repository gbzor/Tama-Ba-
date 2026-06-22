/**
 * Tiny classname merger. We don't pull in clsx/tailwind-merge for one helper.
 * Use: cn('base', condition && 'extra', another)
 */
export function cn(...args: Array<string | false | null | undefined>): string {
  return args.filter(Boolean).join(' ')
}
