# Comprehensive React Low-Level Design (LLD) Interview Questions

> **240 questions** — an exhaustive, searchable reference for React / Frontend / Software Developer interview prep.
>
> For each prompt, practice: **Goal → Constraints → API/Components → State → Data Flow → Edge Cases → Perf & Security → Tests & Monitoring.**

---

## 1 · Component-level / UI Pattern Questions

1. Design a reusable **Modal** component supporting multiple types (confirm, alert, custom) and global control (open/close from anywhere).
2. Design a **Toast / Notification** system (queueing, stacking, dismiss, persist, auto-dismiss).
3. Design a **Loading Skeleton** component and where to place it vs spinners.
4. Design a **Form Builder** supporting dynamic fields, validation, conditional fields, and multi-step flows.
5. Design a **Rich Text Editor** (mentions, image upload, collaborative editing hooks).
6. Design a **Comment Thread** with nested replies, lazy-loading nested comments, and optimistic UI for posting.
7. Design an **Image Gallery / Lightbox** with zoom, swipe, lazy loading and placeholders.
8. Design a **File Upload** widget with chunked uploads, resumability, progress, and drag-and-drop.
9. Design a **Date / Time Picker** component handling time zones, formats, and keyboard accessibility.
10. Design a **Search Autocomplete** component with debounce, keyboard nav, highlighted suggestions, and result caching.
11. Design an **Infinite Scroll / Virtualized List** and explain tradeoffs vs pagination.
12. Design a **Drag & Drop** list with reordering and accessibility.
13. Design a **Data Table** (sorting, filtering, pagination, column resizing, virtualization).
14. Design a **Tree View / Folder Explorer** with lazy loading nodes and move/copy operations.
15. Design a **Multi-select / Tag Input** component with async suggestions.
16. Design a **Wizard / Multi-step Form** preserving state across steps and handling validation per-step.
17. Design a **Reusable Button** system that supports variants, loading states, and accessibility.
18. Design a **Theme / Theming System** (light/dark, custom palettes, CSS variables, SSR theming).
19. Design an **Avatar** component with fallback handling, initials, and lazy image loading.
20. Design a **Rating / Stars** component with keyboard interaction and ARIA.
21. Design a **Pagination Component** and discuss API vs client-side pagination.
22. Design a **Context Menu / Right-click Menu** component accessible by keyboard.
23. Design a **Tooltip** system (positioning, accessibility, delay, portal usage).
24. Design a **Breadcrumb** component for routing hierarchies.
25. Design a **File Explorer** UI (thumbnails, context menus, bulk ops, search/filter).
26. Design a **Calendar / Scheduler** (drag events, collision detection, recurring events).
27. Design a **Payment / Checkout UI** (secure card input, validation, PCI concerns).
28. Design a **Form Validation Engine** that can be reused across components (sync/async rules).
29. Design a **Component Library** (tokens, docs, theming, accessibility standards).
30. Design a **Resizable Split Pane** (drag to resize, persist size).
31. Design a **Command Palette / Spotlight Search** (keyboard-driven, fuzzy matching, plugin architecture like VS Code's Cmd+K).
32. Design a **Kanban Board** (drag across columns, swimlanes, real-time multi-user updates, optimistic reordering).
33. Design a **Chat / Messaging UI** (message grouping, read receipts, typing indicators, infinite scroll upward, media previews).
34. Design a **Code Editor Component** (syntax highlighting, line numbers, bracket matching, minimap — when to embed Monaco vs build custom).
35. Design a **Dashboard Builder** where users can add/remove/resize/rearrange widgets (grid layout, persistence, lazy widget loading).
36. Design a **Notification Center / Inbox** (read/unread, grouping, mark-all-read, real-time badge count).
37. Design a **Stepper / Progress Tracker** that works across async multi-page flows (not just form wizards).
38. Design an **Accordion / Collapsible Section** system that supports exclusive vs independent expand, animated height transitions, and accessibility.
39. Design a **Carousel / Slider** with touch support, autoplay, accessibility, and lazy-loaded slides.
40. Design a **PDF Viewer** component (page navigation, zoom, annotations, text search within PDF).
41. Design an **Audio/Video Player** with custom controls, keyboard shortcuts, captions, and streaming support.
42. Design a **Spreadsheet-like Grid** (cell editing, formulas, copy-paste, undo, column/row resize).
43. Design a **WYSIWYG Email Template Builder** (drag blocks, variable insertion, responsive preview).
44. Design a **Color Picker** component with alpha support, saved palettes, and accessible contrast preview.
45. Design a **Map-based UI** (markers, clustering, geofencing, search within viewport, integration with Mapbox/Google Maps).

---

## 2 · State Management & Data Architecture

46. When do you use local component state vs Context API vs Redux / Zustand / Jotai? Explain with examples.
47. Design a scalable global state model for a large SPA across multiple teams.
48. Design a custom state manager without Redux — what primitives would you expose?
49. How to structure normalized state for lists of items (entities & ids) and update patterns.
50. Design patterns for optimistic updates & rollback on failure.
51. Cache invalidation strategies on the client after mutations.
52. How to keep derived/computed state performant (selectors, memoization).
53. Compare useReducer vs useState for complex forms — when to prefer reducers?
54. How would you manage per-component subscriptions to avoid unnecessary re-renders?
55. How to implement a scoped/global event bus in React.
56. Strategies to share state between React and non-React parts of an app.
57. Cross-tab state synchronization (localStorage, BroadcastChannel).
58. Designing feature flags and toggles for the front-end.
59. How to design transient UI state vs persistent user state.
60. Data normalization and client schema design for GraphQL and REST.
61. Handling pagination cursors and merging pages in state.
62. Designing store boundaries in a monorepo with multiple micro frontends.
63. Designing contract / API versioning considerations on the frontend.
64. Strategies for state persistence and rehydration (localStorage, IndexedDB).
65. Design a mechanism for undo/redo in UI editing (command pattern).

---

## 3 · Performance & Rendering Optimizations

66. How to optimize a view rendering thousands of dynamic components?
67. Explain re-render causes and how to minimize them (keys, memo, pure components).
68. When and how to use React.memo, useMemo, useCallback — tradeoffs.
69. How to profile & debug performance regressions (React Profiler, Chrome DevTools).
70. Design virtualized lists (react-window/react-virtualized) and handling variable row heights.
71. Explain Layout Thrashing, forced synchronous layouts, and how to avoid them.
72. Discuss code splitting and chunking strategies (dynamic import, route-based).
73. Explain tree-shaking and how to keep bundle size small.
74. Design an image optimization strategy (srcset, lazy loading, next/image-like approach).
75. How to reduce Cumulative Layout Shift (CLS) in component design.
76. How to optimize CPU-bound tasks (web workers).
77. Strategies for efficient animations (transform vs top/left, will-change, requestAnimationFrame).
78. Explain expensive reconciliation patterns and how to refactor components.
79. How to avoid memory leaks (cleanup effects, long-lived timers, DOM references).
80. How to use incremental rendering / chunked rendering for heavy pages.
81. Explain critical rendering path for single-page apps and how to speed first meaningful paint.
82. Design a lazy-loading strategy for images, components, and data.
83. Handling large JSON payloads on client (streaming, pagination, compression).

---

## 4 · React Internals & Rendering Model

84. Explain reconciliation and the diffing algorithm.
85. Explain React Fiber — why it exists and what problems it solves.
86. Explain component lifecycle under hooks (useEffect ordering, cleanup).
87. Explain the concept of keys and common bugs when keying incorrectly.
88. Deep dive: how setState batching works and when updates are synchronous vs async.
89. Explain portals and when to use them.
90. Explain refs, forwardRef, and useImperativeHandle.
91. Explain error boundaries: when to use them and limitations.
92. Explain hydration and hydration mismatches in SSR.
93. Explain event delegation in React and synthetic events.
94. Implement a simple custom hook and discuss design for reusability.
95. Explain memoization internals and pitfalls (stale closures).
96. How to implement render prop vs HOC vs hook patterns and choose between them.
97. Explain how Suspense works for code-splitting and for data (current state of Suspense for data).
98. How does React schedule rendering priorities (interactive vs background)?
99. Explain why keys should be stable and unique and their effect on diffing.

---

## 5 · Concurrency & React 18+ Features

100. Explain concurrent rendering and the benefits of concurrency.
101. Explain startTransition, useDeferredValue and when to use them.
102. Suspense for data: how it changes data fetching patterns.
103. Server Components overview: where to use server components vs client components.
104. Streaming SSR and progressive hydration.
105. How to design components to be concurrent-safe (avoiding side effects during render).
106. Handling interruptions / aborts for long-running renders (cancellation patterns).

---

## 6 · Data Fetching, Caching & Networking

107. Design a front-end caching layer (stale-while-revalidate, cache durations).
108. Design a data-fetching hook that supports caching, dedupe, retries and pagination.
109. Compare REST vs GraphQL for client design; pros/cons for caching & batching.
110. Using WebSockets or SSE for real-time UI: design message handling and reconcile with local state.
111. Design a polling vs push strategy for live data and backoff strategies.
112. Design file upload API interactions, chunking, and resumable uploads.
113. Handling GraphQL subscriptions and client-side cache updates.
114. How to implement ETag / If-Modified-Since style caching on client.
115. Design API error-handling and retry strategy on the client (exponential backoff, idempotency).
116. Designing optimistic UI updates with conflict resolution.
117. How to prevent overfetching and unnecessary requests (debounce, dedupe).
118. Using AbortController to cancel obsolete fetches in components.
119. Design a client-side connector for third-party APIs with rate-limit handling.
120. How to secure client-side tokens and manage refresh tokens in single-page apps.

---

## 7 · Routing, SSR & SEO

121. Design a routing strategy for a multi-tenant SPA (role-based routes, nested routes).
122. Explain dynamic routing vs static routing tradeoffs.
123. SSR vs CSR vs SSG — when to choose each and how to design components accordingly.
124. Handling authentication & protected routes in SSR (cookie vs token).
125. Dealing with meta tags & SEO in SPAs (dynamic meta, prerendering).
126. Handling deep linking and scroll restoration.
127. URL design and state in the URL (query params vs path params).
128. Hydration mismatches: root causes and fixes.
129. Designing canonical routes and redirects at the edge.
130. Designing internationalized routes and locale-aware SEO.

---

## 8 · Accessibility (a11y), Internationalization & UX

131. Designing accessible components (ARIA, keyboard navigation, focus management).
132. Focus management in modal/dialog components.
133. Accessible drag & drop and alternative interactions.
134. Designing for screen readers (live regions, aria-live, roles).
135. Designing RTL (right-to-left) support and mirrored layouts.
136. Date/time localization and number/currency formatting.
137. Designing color contrast and accessible theme switching.
138. Handling font loading to avoid FOIT/FOUT and layout shift.
139. Designing for low-vision/high-contrast modes.

---

## 9 · Testing, Reliability & Observability

140. Designing components for testability (props, dependency injection, small units).
141. Unit testing hooks & components with Jest + React Testing Library.
142. Integration tests for data flows; end-to-end with Cypress / Playwright.
143. Mocking network calls and third-party SDKs for reliable tests.
144. Snapshot testing pros/cons and when to use them.
145. Designing end-to-end flaky test mitigation strategies.
146. Instrumenting performance: Web Vitals, custom metrics, and tracing.
147. Error reporting & monitoring (Sentry, Bugsnag) and what to log.
148. Designing health checks for frontend (Lighthouse CI / automated audits).
149. Building regression detection into CI (bundle size, Lighthouse scores).

---

## 10 · Security & Privacy (Frontend LLD)

150. XSS prevention in React (dangerouslySetInnerHTML risks and sanitization).
151. CSRF protections on frontend when using cookies.
152. Secure storage of tokens (cookies vs localStorage tradeoffs).
153. Handling OAuth flows securely in SPAs (PKCE).
154. Designing input validation boundaries and server-side validation assumptions.
155. Protecting sensitive UI against clickjacking (X-Frame-Options handling).
156. Rate-limiting user actions on client-side to avoid accidental DDoS.
157. Privacy-compliant analytics (consent, opt-out, PII handling).

---

## 11 · Build, Bundling, Monorepos, Infra & Deployment

158. How to design a bundling strategy to support multiple entry points and code splitting.
159. Using Module Federation for micro frontends — design considerations and versioning.
160. Monorepo patterns for shared UI libraries (package boundaries, releases).
161. CI/CD pipeline for frontend: lint/tests/build, preview environments, canary deploys.
162. How to design asset caching and invalidation strategy (cache-busting).
163. Design considerations for edge functions and CDN-based rendering.
164. Feature flag rollout & A/B testing integration patterns.
165. Designing rollback strategies for a faulty frontend release.
166. Designing progressive rollouts and health monitoring (SLOs for front-end).

---

## 12 · UX & Practical Interaction Patterns

167. Design a progressive enhancement strategy (JS optional experiences fallback).
168. Designing skeleton screens vs spinners decisions.
169. Handling network loss gracefully (offline UX, queuing actions).
170. Push notification UI design and permission flows.
171. Local-first / offline-first app architecture (IndexedDB syncing strategies).
172. Designing auditing/tracking for user actions (privacy mindful).
173. Designing complex interactions like canvas drawing or image editing in React.
174. Handling large tables of data with filters, aggregations, and pivot-like interactions.

---

## 13 · Misc LLD Prompts & Scenario Questions (Frequently Asked Live)

175. "Draw the component tree & state shape for X feature (e.g., shopping cart checkout)."
176. "You have to integrate a third-party chat widget — how do you isolate and test it?"
177. "How would you migrate a large app from class components to hooks gradually?"
178. "How to split a large repo into micro frontends with minimal user disruption?"
179. "You need to implement offline sync for forms — design conflict resolution."
180. "Design an experiment to measure whether code-splitting improved perceived load time."
181. "Design rate-limited autocomplete so it doesn't exceed API limits."
182. "How would you add telemetry instrumentation for a new critical user flow?"
183. "You're asked to make a 3rd party payment flow accessible and testable — how?"
184. "Design a rollback mechanism if a new component causes too many errors in Sentry."
185. "Design data migration strategy when backend API changes field names."
186. "Design a predictable animation system across the app (consistent easings, durations)."
187. "Implement a debounced save in form drafts (avoid data loss)."
188. "Design multi-locale formatting pipeline for dates, numbers, pluralization."
189. "Design a frontend approach to bulk editing many items concurrently."
190. "How to do graceful degradation when a dependent CDN is down?"

---

## 14 · Real-time & Collaboration

191. Design a **real-time collaborative editing** system (CRDTs vs OT, cursor presence, conflict resolution UI).
192. Design a **live cursor / presence** system showing other users' positions in a shared workspace.
193. Design a **real-time multiplayer game lobby** UI (player list, ready state, countdown, latency display).
194. Design a **collaborative whiteboard** (drawing, shapes, sticky notes, multi-user with undo per user).

---

## 15 · Auth, Roles & Permissions UI

195. Design a **Role-Based Access Control (RBAC) UI** — conditionally rendering UI elements, routes, and actions based on permissions.
196. Design a **Login / Auth flow** end-to-end (social login, MFA, session timeout, "remember me", token refresh UX).
197. Design a **User Onboarding / Guided Tour** component (step highlights, tooltips, skip/resume, progress tracking).
198. Design an **Impersonation UI** for admin users (visual indicators, safe exit, audit trail).

---

## 16 · State Machines & Complex Interaction Modeling

199. When and how to use **state machines (XState)** to model complex UI flows — compare with useReducer.
200. Design a **multi-step async workflow** (e.g., order placement) using state machines with retry, cancel, and timeout states.
201. Design a **complex form with branching logic** modeled as a state machine (insurance application, tax filing).

---

## 17 · Mobile, Responsive & Cross-platform

202. Design a **responsive navigation system** (hamburger menu, bottom tabs, sidebar — breakpoint-driven transitions).
203. Design **touch gesture handling** in React (swipe to delete, pull to refresh, pinch to zoom — without a library).
204. Design a **Progressive Web App** shell (service worker strategy, install prompt, offline fallback).
205. Design a **bottom sheet / drawer** component for mobile-first UIs (snap points, drag to dismiss, backdrop).
206. How to handle **viewport and virtual keyboard** issues on mobile web (input focus shifting layout).

---

## 18 · Error Handling & Resilience Patterns

207. Design a **global error handling strategy** — error boundaries per route vs per feature, fallback UI hierarchy.
208. Design a **retry UI pattern** for failed operations (inline retry, toast with retry, automatic retry with backoff indicator).
209. Design a **graceful degradation system** — feature-level fallbacks when a service is down (circuit breaker on the client).
210. Design a **dead letter queue** for failed client-side mutations that should be retried later.

---

## 19 · Developer Experience & Tooling

211. Design **custom ESLint rules** or **codemods** for enforcing patterns across a large React codebase.
212. Design a **Storybook-based development workflow** (visual regression testing, accessibility checks, interaction testing).
213. Design **developer tools** (browser extension or devtools panel) for debugging your app's state and events.
214. How to design **backward-compatible component APIs** when evolving a shared component library.

---

## 20 · AI / LLM Integration (2025+)

215. Design a **streaming chat UI** for an LLM-powered feature (token-by-token rendering, stop generation, markdown rendering).
216. Design a **prompt-based UI generator** — user describes a layout, AI returns components (how to sandbox, validate, render).
217. Design an **AI-assisted form fill** — suggestions, auto-complete from context, with user override and correction UX.
218. Design a **RAG-powered search UI** (query → retrieval → generated answer with source citations and feedback).

---

## 21 · Web Platform & Browser APIs

219. Design around the **View Transitions API** for smooth page-to-page animations in an SPA.
220. Design a component that uses the **Intersection Observer** API for scroll-triggered animations, analytics tracking, and lazy loading.
221. Design offline data sync using **Background Sync API** and **IndexedDB**.
222. Design a **clipboard interaction** system (copy rich content, paste handling, paste-as-image).
223. Design a feature using the **Web Share API** and **Share Target API** for native-like sharing.
224. How to leverage **Web Workers / SharedWorkers** for offloading computation in a React app.
225. Design around **Permissions API** — requesting camera, microphone, notification, and geolocation with good UX.

---

## 22 · Architecture & Design Philosophy

226. How to design a **compound component pattern** (Select + Option, Tabs + TabPanel) and when it beats props-driven design.
227. Design a **headless component library** (logic-only hooks) and explain when to choose headless vs styled.
228. Design a **plugin/extension architecture** for a React application (registering features dynamically).
229. How to design **API contracts and type-safety** between frontend and backend (tRPC, OpenAPI codegen, Zod schemas).
230. Design a **feature module architecture** — how to organize a large React app by feature vs by type (folder structure, lazy boundaries, shared kernel).
231. Design a **dependency injection pattern** in React (for testability and swappable implementations).

---

## 23 · Analytics, Monitoring & Experimentation

232. Design a **client-side event tracking architecture** (batching events, consent-aware, schema-validated).
233. Design an **A/B testing framework** on the client (variant assignment, flicker prevention, metrics collection).
234. Design a **session replay** integration strategy (what to capture, PII redaction, performance impact).
235. Design **Real User Monitoring (RUM)** — collecting Web Vitals, custom timing metrics, and correlating with user segments.

---

## 24 · Advanced Data Patterns

236. Design a **client-side full-text search** (indexing, fuzzy matching, highlighting — using Fuse.js, MiniSearch, or custom).
237. Design **data synchronization** between multiple browser tabs with conflict resolution.
238. Design an **event sourcing pattern** on the frontend for audit trails and time-travel debugging.
239. Design **pagination strategies in depth** — offset vs cursor vs keyset, and how each affects UI state and caching.
240. Design a **real-time data aggregation dashboard** — handling high-frequency updates without UI jank (throttling, buffering, chart updates).

---

## How to Use This List

- **Practice by sketching:** component tree, props/state shape, where state lives, lifecycle/data flow, and 2–3 optimization/tradeoff choices.
- **For "design this component" prompts:** show a minimal props API, state diagram, and mention accessibility and testing.
- **Structure answers in interviews:** Goal → Constraints → API/Components → State → Data Flow → Edge Cases → Perf & Security → Tests & Monitoring.
- **Group study sessions:** pick 3–5 questions per session from different sections.
- **Mock interviews:** have a partner pick a random question and give you 20–30 minutes to design and explain.

---

*Total: 240 questions across 24 categories.*
