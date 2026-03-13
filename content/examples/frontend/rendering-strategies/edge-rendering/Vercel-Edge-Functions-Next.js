// app/products/page.tsx - Edge Runtime
import { cookies } from 'next/headers';

// Force this route to use Edge Runtime (not Node.js)
export const runtime = 'edge';

export default async function ProductsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  // Fetch data from edge-compatible API or database
  const products = await fetch('https://api.example.com/products', {
    headers: {
      'X-User-ID': userId || 'anonymous',
    },
    // Cache for 60 seconds at the edge
    next: { revalidate: 60 },
  }).then(res => res.json());

  return (
    <div>
      <h1>Products for User {userId}</h1>
      <div className="grid">
        {products.map((product) => (
          <div key={product.id}>
            <h2>{product.name}</h2>
            <p>\${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Result:
// - Deploys to 300+ Vercel/Cloudflare edge locations
// - TTFB: 50-100ms globally (vs. 200-400ms origin SSR)
// - Personalized for each user (via cookies)
// - Response cached for 60s at each edge location