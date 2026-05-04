export function formatInTimeZone(args: {
  isoDateTime: string; // e.g. 2026-05-04T12:30:00Z
  timeZone: string; // e.g. "Asia/Kolkata"
  locale: string;
}) {
  const { isoDateTime, timeZone, locale } = args;
  const d = new Date(isoDateTime);
  const fmt = new Intl.DateTimeFormat(locale, {
    timeZone,
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  return fmt.format(d);
}

