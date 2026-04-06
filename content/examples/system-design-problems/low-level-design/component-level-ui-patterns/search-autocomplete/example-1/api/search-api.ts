import type { Suggestion } from '../lib/autocomplete-types';

// Mock dataset for demonstration
const MOCK_DATA: Suggestion[] = [
  { id: '1', title: 'React', subtitle: 'A JavaScript library for building user interfaces' },
  { id: '2', title: 'React Native', subtitle: 'Framework for building native apps using React' },
  { id: '3', title: 'React Router', subtitle: 'Declarative routing for React applications' },
  { id: '4', title: 'React Query', subtitle: 'Powerful data synchronization for React' },
  { id: '5', title: 'React Testing Library', subtitle: 'Simple and complete React DOM testing utilities' },
  { id: '6', title: 'React Hook Form', subtitle: 'Performant, flexible forms with easy-to-use validation' },
  { id: '7', title: 'Redux', subtitle: 'Predictable state container for JavaScript apps' },
  { id: '8', title: 'Redux Toolkit', subtitle: 'The official, opinionated, batteries-included toolset for Redux' },
  { id: '9', title: 'Remix', subtitle: 'Full stack web framework built on React Router' },
  { id: '10', title: 'Next.js', subtitle: 'The React framework for production' },
  { id: '11', title: 'Node.js', subtitle: 'JavaScript runtime built on Chrome V8 engine' },
  { id: '12', title: 'TypeScript', subtitle: 'Typed superset of JavaScript that compiles to plain JavaScript' },
  { id: '13', title: 'Tailwind CSS', subtitle: 'A utility-first CSS framework for rapid UI development' },
  { id: '14', title: 'GraphQL', subtitle: 'Query language for APIs and runtime for executing queries' },
  { id: '15', title: 'REST API', subtitle: 'Representational state transfer architectural style' },
  { id: '16', title: 'WebSocket', subtitle: 'Protocol providing full-duplex communication channels over TCP' },
  { id: '17', title: 'Redis', subtitle: 'In-memory data structure store used as database/cache/message broker' },
  { id: '18', title: 'PostgreSQL', subtitle: 'Advanced open source relational database' },
  { id: '19', title: 'MongoDB', subtitle: 'General purpose, document-based, distributed database' },
  { id: '20', title: 'Docker', subtitle: 'Platform for developing, shipping, and running applications in containers' },
];

/**
 * Simulates an API call to fetch search suggestions.
 * Filters MOCK_DATA by query string with artificial latency.
 *
 * @param query - The search query string
 * @param signal - AbortSignal for cancelling in-flight requests
 * @returns Promise resolving to filtered suggestions
 */
export async function fetchSuggestions(
  query: string,
  signal: AbortSignal
): Promise<Suggestion[]> {
  // Simulate network latency (100-300ms)
  const latency = Math.floor(Math.random() * 200) + 100;

  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, latency);

    // Listen for abort signal
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    }, { once: true });
  });

  // Filter by query (case-insensitive substring match on title)
  const normalizedQuery = query.toLowerCase().trim();
  const results = MOCK_DATA.filter((item) =>
    item.title.toLowerCase().includes(normalizedQuery)
  );

  // Limit to 10 results
  return results.slice(0, 10);
}
