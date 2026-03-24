import type { FaqItem } from "@/components/FAQ";
import type { Spec } from "@/components/Specs";

export type Product = {
  name: string;
  tagline: string;
  description: string;
  priceUsd: number;
  specs: Spec[];
  faq: FaqItem[];
};

export function getProduct(): Product {
  return {
    name: "Nimbus ANC Headphones",
    tagline: "Comfortable noise-cancelling headphones tuned for long focus sessions.",
    description:
      "Semantic HTML helps both humans and crawlers understand where the main content starts, how it is organized, and which parts are supporting context. Product pages benefit from rich, structured sections even without schema markup.",
    priceUsd: 249,
    specs: [
      { name: "Battery", value: "30 hours" },
      { name: "Weight", value: "265 g" },
      { name: "Connectivity", value: "Bluetooth 5.3" },
      { name: "Codecs", value: "AAC, SBC" }
    ],
    faq: [
      { question: "Is the FAQ content crawlable?", answer: "Yes. The answers exist in the HTML response; <details> controls disclosure for users." },
      { question: "Should I put everything in <article>?", answer: "No. Use <article> for self-contained primary content; keep tangential content in <aside>." }
    ]
  };
}

