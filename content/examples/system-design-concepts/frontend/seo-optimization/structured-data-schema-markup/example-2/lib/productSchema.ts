export function productSchema(params: {
  name: string;
  description: string;
  sku: string;
  priceUsd: number;
  ratingValue: number;
  reviewCount: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: params.name,
    description: params.description,
    sku: params.sku,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: params.priceUsd.toFixed(2),
      availability: "https://schema.org/InStock"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: params.ratingValue,
      reviewCount: params.reviewCount
    }
  };
}

