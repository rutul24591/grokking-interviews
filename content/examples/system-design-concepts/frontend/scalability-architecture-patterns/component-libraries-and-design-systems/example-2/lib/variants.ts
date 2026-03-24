import { cn } from "@/lib/cn";

type VariantMap = Record<string, Record<string, string>>;

export function variants<
  TVariants extends VariantMap,
  TDefaults extends Partial<{ [K in keyof TVariants]: keyof TVariants[K] }>
>(base: string, config: { variants: TVariants; defaults?: TDefaults }) {
  type Props = { className?: string } & {
    [K in keyof TVariants]?: keyof TVariants[K];
  };

  return (props: Props = {}) => {
    const out: string[] = [base];
    for (const k of Object.keys(config.variants) as Array<keyof TVariants>) {
      const value = (props[k] ?? config.defaults?.[k]) as keyof TVariants[typeof k] | undefined;
      if (!value) continue;
      const cls = config.variants[k][value as string];
      if (cls) out.push(cls);
    }
    if (props.className) out.push(props.className);
    return cn(...out);
  };
}

