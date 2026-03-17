/**
 * Utility function to conditionally join class names together.
 * Similar to clsx or classnames libraries.
 *
 * @example
 * classNames('foo', 'bar') // => 'foo bar'
 * classNames('foo', null, 'bar') // => 'foo bar'
 * classNames('foo', condition && 'bar') // => 'foo' or 'foo bar'
 */
export function classNames(
  ...classes: Array<string | undefined | null | false>
): string {
  return classes.filter(Boolean).join(" ");
}
