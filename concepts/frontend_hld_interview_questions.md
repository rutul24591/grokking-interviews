# Frontend / React High-Level Design (HLD) Interview Questions

## Comprehensive & Exhaustive List — 309 Questions across 22 Categories

> **200 Core Questions + 109 New Additions**

---

### Scope

- **ONLY High-Level Design (HLD / System Design)** — NO Low-Level Design (LLD)
- React Developer / Frontend Engineer / Software Engineer (Frontend-heavy)
- Mid → Senior → Staff level interviews
- Each question is a 15–45 minute discussion covering requirements, architecture, trade-offs, failures, and metrics

**Legend:** 🆕 = Newly added questions beyond the original 200

---

## Table of Contents

| # | Section | Questions |
|---|---------|-----------|
| 1 | Product & Requirement Scoping | 14 |
| 2 | Frontend Architecture Patterns | 15 |
| 3 | Component System & Design Systems | 14 |
| 4 | State Management & Data Flow | 14 |
| 5 | Data Fetching & API Integration | 14 |
| 6 | Performance & Rendering Strategy | 15 |
| 7 | Offline, PWA & Resilience | 13 |
| 8 | Scalability & Client Constraints | 14 |
| 9 | Security & Privacy (Frontend) | 14 |
| 10 | Realtime & Collaboration | 14 |
| 11 | Testing, Quality & Releases | 14 |
| 12 | Observability & Monitoring | 14 |
| 13 | Build Systems & Developer Experience | 14 |
| 14 | Backend / Edge / CDN Integration | 14 |
| 15 | Mobile, Responsive & Cross-Platform | 14 |
| 16 | SEO, Accessibility & Content | 14 |
| 17 | Third-Party Integrations | 14 |
| 18 | Org, Governance & Process | 14 |
| 19 | Interview-Style HLD Prompts | 20 |
| 20 | Advanced Trade-offs & Meta Questions | 18 |
| 21 | AI, LLM & Emerging Tech in Frontend | 10 |
| 22 | Video, Media & Rich Content | 8 |

---

## 1. Product & Requirement Scoping

1. Design the frontend architecture for a new SPA — how do you start?
2. How do you gather and document frontend requirements?
3. Performance vs velocity — how do you decide?
4. What frontend metrics define "success"?
5. How do you design feature rollout strategies?
6. Migration plan from legacy frontend to React.
7. Shared UI library vs per-team components.
8. i18n & RTL considerations at architecture level.
9. Supporting multiple client types (web, mobile web).
10. Designing frontend for A/B testing and experiments.
11. 🆕 How do you define and enforce a frontend performance budget during product scoping?
12. 🆕 Designing for regulatory requirements (HIPAA, SOX) in frontend architecture.
13. 🆕 How do you scope frontend work for a greenfield product with uncertain requirements?
14. 🆕 Frontend architecture for multi-geography product launches with different feature sets.

---

## 2. Frontend Architecture Patterns

15. Architecture for an e-commerce frontend.
16. Real-time analytics dashboard frontend.
17. SPA with SSR — architecture and trade-offs.
18. SSR vs SSG vs CSR decision making.
19. Multi-tenant / white-label frontend design.
20. Monorepo architecture for multiple React apps.
21. Micro-frontend architecture — boundaries.
22. Module Federation strategy.
23. Permission-based feature loading.
24. Frontend plugin architecture.
25. 🆕 Island architecture (Astro-style partial hydration) — when and why?
26. 🆕 Architecture for a frontend that must coexist with multiple frameworks (React + Vue + legacy jQuery).
27. 🆕 Resumability vs hydration (Qwik-style) — trade-offs and applicability.
28. 🆕 Frontend architecture for an internal developer portal / platform.
29. 🆕 Event-driven frontend architecture using a client-side event bus.

---

## 3. Component System & Design Systems

30. Designing a scalable component library.
31. Versioning & governance of shared components.
32. Theming and design tokens.
33. Accessibility-first component systems.
34. High-level design of data-heavy components (tables, charts).
35. Third-party embeddable widgets.
36. Form system architecture.
37. Customization without forking components.
38. Internationalized component design.
39. Motion and animation consistency.
40. 🆕 Federated design system across multiple business units / acquisitions.
41. 🆕 Design system adoption metrics and governance dashboards.
42. 🆕 Architecture for a headless component library (logic-only, BYO rendering).
43. 🆕 Compound component patterns at scale — how to design flexible yet consistent APIs.

---

## 4. State Management & Data Flow

44. Choosing a state management strategy.
45. Global vs local state boundaries.
46. Data caching & synchronization strategy.
47. Preventing unnecessary re-renders at scale.
48. Server-driven UI trade-offs.
49. GraphQL client architecture.
50. Infinite scroll vs pagination.
51. Cross-tab state synchronization.
52. Derived state & memoization strategy.
53. Multi-tab cart/session consistency.
54. 🆕 State management for AI/LLM streaming responses in a chat UI.
55. 🆕 URL-as-state architecture — when to make URL the single source of truth.
56. 🆕 State machine / statechart-driven UI architecture (XState patterns).
57. 🆕 Handling optimistic state rollback in complex multi-step workflows.

---

## 5. Data Fetching & API Integration

58. Fetch strategy for high latency networks.
59. Streaming & partial updates.
60. Cache invalidation strategy.
61. Offline-first data sync.
62. Auth token refresh handling.
63. Optimistic UI architecture.
64. Preventing overfetching.
65. GraphQL cache eviction policies.
66. Hybrid pre-render + runtime fetch.
67. Global error handling architecture.
68. 🆕 Designing frontend for Server-Sent Events (SSE) vs WebSockets vs long polling.
69. 🆕 API versioning strategy from the frontend consumer perspective.
70. 🆕 Data prefetching architecture using route-based predictions.
71. 🆕 Frontend architecture for consuming event-driven / async APIs (webhooks, polling fallback).

---

## 6. Performance & Rendering Strategy

72. Designing for fast TTI (Time to Interactive).
73. Bundle size optimization.
74. Code splitting strategy.
75. Critical CSS & font loading.
76. Core Web Vitals strategy.
77. Image delivery architecture.
78. Web Workers usage strategy.
79. Animation performance architecture.
80. Network request prioritization.
81. Preventing layout thrashing.
82. 🆕 React Server Components architecture and data flow.
83. 🆕 Selective hydration strategy for large pages.
84. 🆕 INP (Interaction to Next Paint) optimization architecture.
85. 🆕 Long-task breaking strategies and scheduler API usage.
86. 🆕 Virtual scrolling architecture for massive lists / grids.

---

## 7. Offline, PWA & Resilience

87. PWA architecture.
88. Service Worker caching strategy.
89. Conflict resolution for offline edits.
90. Offline UX design.
91. Background sync strategy.
92. Service Worker lifecycle management.
93. Graceful degradation design.
94. Cache version migrations.
95. Push notification architecture.
96. Progressive enhancement strategy.
97. 🆕 Designing resilient UX for flaky / intermittent network conditions (e.g., elevators, tunnels).
98. 🆕 Frontend circuit-breaker patterns for unreliable third-party APIs.
99. 🆕 Architecture for installable desktop web apps (PWA + Electron trade-offs).

---

## 8. Scalability & Client Constraints

100. Frontend scaling for millions of users.
101. Client CPU/memory budgeting.
102. Handling massive datasets on the client.
103. Preventing bundle size regressions.
104. Feature flag systems at scale.
105. CDN asset strategies.
106. Multi-locale asset delivery.
107. Cross-region latency considerations.
108. Edge vs browser logic decisions.
109. Realtime concurrency limits.
110. 🆕 Frontend cost optimization — reducing CDN, edge compute, and bandwidth bills.
111. 🆕 Designing for WebAssembly (WASM) integration in performance-critical frontend paths.
112. 🆕 Memory leak detection and prevention architecture in long-lived SPAs.
113. 🆕 Lazy module loading with dependency graphs at scale.

---

## 9. Security & Privacy (Frontend)

114. XSS, CSRF, clickjacking defenses.
115. Content Security Policy design.
116. Token storage strategy.
117. GDPR/CCPA frontend compliance.
118. OAuth & SSO frontend flows.
119. PII masking in logs and telemetry.
120. Third-party script security.
121. Browser permission management.
122. Client-side rate limiting.
123. Frontend incident response planning.
124. 🆕 Subresource Integrity (SRI) and supply-chain security for frontend dependencies.
125. 🆕 Frontend architecture for zero-trust environments.
126. 🆕 Secure handling of sensitive data in browser memory (credentials, tokens, PII).
127. 🆕 Designing frontend audit trails and tamper-evident logging.

---

## 10. Realtime & Collaboration

128. Collaborative editor architecture.
129. Embedded chat widget design.
130. Presence & typing indicators.
131. WebSocket reconnection strategies.
132. Bandwidth-efficient realtime updates.
133. Subscription sharding.
134. Conflict resolution models (CRDT, OT).
135. QoS for realtime events.
136. Offline + realtime reconciliation.
137. Hybrid polling & push models.
138. 🆕 Architecture for real-time multiplayer/interactive experiences on the web.
139. 🆕 Cursor/pointer sharing and live collaboration overlays (Figma-style).
140. 🆕 Designing notification systems — in-app, push, email orchestration from frontend perspective.
141. 🆕 Realtime data visualization with streaming backends (e.g., live dashboards with 10k+ data points).

---

## 11. Testing, Quality & Releases

142. Frontend testing pyramid.
143. Accessibility testing strategy.
144. Canary deployments for frontend.
145. Visual regression testing.
146. Performance regression prevention.
147. Telemetry-gated releases.
148. Test data management.
149. Security scanning in CI.
150. UX sign-off workflows.
151. Experiment observability.
152. 🆕 Contract testing between frontend and backend (Pact, schema validation).
153. 🆕 Testing strategy for micro-frontends — integration across team boundaries.
154. 🆕 Chaos engineering for frontend — simulating failures in CI/staging.
155. 🆕 AI-assisted testing — auto-generating and maintaining test suites.

---

## 12. Observability & Monitoring

156. Frontend KPIs and dashboards.
157. Alerting strategies for frontend issues.
158. Client error tracking architecture.
159. Sampling strategies for high-traffic telemetry.
160. Frontend-backend distributed trace correlation.
161. Frontend SLO design.
162. Third-party performance monitoring.
163. Incident playbooks for frontend.
164. Experiment metrics and analysis.
165. Privacy-preserving telemetry.
166. 🆕 Real User Monitoring (RUM) architecture at scale.
167. 🆕 Session replay systems — architecture, privacy, and storage.
168. 🆕 Anomaly detection in frontend metrics (auto-alerting on regressions).
169. 🆕 Observability for Server Components and edge-rendered content.

---

## 13. Build Systems & Developer Experience

170. CI/CD architecture for frontend.
171. Performance budgets in CI.
172. Prod-like local environments.
173. TypeScript adoption strategy.
174. Release coordination across packages.
175. Preview environments (per-PR deploys).
176. Dependency upgrade workflows.
177. Developer onboarding experience.
178. Reproducible builds.
179. CI test parallelization.
180. 🆕 Migrating build tools (Webpack → Vite / Turbopack / RSPack) — strategy and risks.
181. 🆕 Monorepo tooling architecture (Nx, Turborepo) — caching, task orchestration.
182. 🆕 AI-powered developer tools integration (Copilot, Claude Code) in frontend DX.
183. 🆕 Custom ESLint/linting rules as architectural guardrails.

---

## 14. Backend / Edge / CDN Integration

184. Edge rendering strategy.
185. CDN cache invalidation.
186. API gateway contracts.
187. Schema evolution strategy.
188. Backend failure fallbacks.
189. Streaming SSR & hydration.
190. Resource hints strategy (preload, prefetch, preconnect).
191. Cross-team release coordination.
192. Feature flag APIs.
193. Backend-for-Frontend (BFF) design.
194. 🆕 Edge middleware architecture (Next.js middleware, Cloudflare Workers).
195. 🆕 Multi-CDN strategy — failover, latency-based routing.
196. 🆕 Frontend architecture for serverless backends (Lambda, edge functions).
197. 🆕 Incremental Static Regeneration (ISR) — architecture and cache consistency.

---

## 15. Mobile, Responsive & Cross-Platform

198. Responsive architecture.
199. Mobile performance constraints.
200. Web + React Native code sharing strategy.
201. Gesture & navigation systems.
202. Mobile asset optimization.
203. Layout breakpoint systems.
204. Battery-efficient UX.
205. Low-end device support.
206. Mobile offline UX.
207. Mobile conversion metrics.
208. 🆕 Architecture for responsive email templates rendered from React.
209. 🆕 Cross-platform design token synchronization (web, iOS, Android).
210. 🆕 Container queries vs media queries — architectural implications.
211. 🆕 Hybrid app architecture (WebView + native bridges) — communication and performance.

---

## 16. SEO, Accessibility & Content

212. SEO-friendly SPA architecture.
213. Metadata & structured data strategy.
214. Accessibility roadmap for a large application.
215. Assistive tech testing.
216. SEO with dynamic rendering.
217. ARIA patterns at scale.
218. Keyboard navigation architecture.
219. Multilingual SEO strategy.
220. Media CDN strategy.
221. Accessibility KPIs.
222. 🆕 Content management system (CMS) integration architecture — headless CMS patterns.
223. 🆕 Designing for screen reader performance in complex SPAs.
224. 🆕 Architecture for AI-generated content rendering and SEO implications.
225. 🆕 Focus management architecture for modals, drawers, and route transitions.

---

## 17. Third-Party Integrations

226. Third-party script governance.
227. Sandbox strategies for third-party code.
228. Analytics performance control.
229. Payment provider integration architecture.
230. Provider migration strategy.
231. Third-party outage handling.
232. Secure embed SDK design.
233. Consent management systems.
234. Third-party SLA monitoring.
235. Plugin API governance.
236. 🆕 Designing a frontend SDK for external developers to embed your product.
237. 🆕 Map provider integration (Google Maps, Mapbox) — performance and cost optimization.
238. 🆕 Frontend architecture for AI/ML model inference (TensorFlow.js, ONNX Runtime Web).
239. 🆕 Ad tech integration architecture — performance impact and user experience trade-offs.

---

## 18. Org, Governance & Process

240. Team ownership models for frontend.
241. Component ownership strategy.
242. Architecture Decision Records.
243. Performance budget enforcement.
244. Breaking change rollout processes.
245. Deprecation policies.
246. Production readiness reviews.
247. Frontend documentation strategy.
248. Mentoring frontend system design.
249. ROI estimation for re-architecture.
250. 🆕 Inner-source model for frontend — enabling contributions across teams.
251. 🆕 Frontend guild / community of practice structure.
252. 🆕 Technical debt quantification and prioritization frameworks.
253. 🆕 Architecture review boards for frontend — scope, cadence, decision-making.

---

## 19. Interview-Style HLD Prompts

254. Design the frontend for a social media news feed.
255. Design a multi-step checkout flow.
256. Design a multi-brand design system.
257. Design a large file upload UI with resume capability.
258. Design a real-time dashboard frontend.
259. Design a search UI with autocomplete, filters, and facets.
260. Plan a REST → GraphQL migration.
261. Design a low-latency trading UI.
262. Design cross-device user settings sync.
263. Design an embeddable analytics SDK.
264. 🆕 Design the frontend for an AI chatbot with streaming responses, history, and multi-modal input.
265. 🆕 Design the frontend for a video conferencing application (Zoom/Meet-style).
266. 🆕 Design a frontend for a no-code / low-code application builder.
267. 🆕 Design a frontend for a real-time collaborative whiteboard (Miro/FigJam-style).
268. 🆕 Design a frontend for a multi-tenant SaaS admin dashboard with role-based views.
269. 🆕 Design the frontend for a music/audio streaming application.
270. 🆕 Design a frontend for a real-time multiplayer game lobby and matchmaking system.
271. 🆕 Design the frontend for a document management system with preview, versioning, and annotations.
272. 🆕 Design a frontend for a maps-based delivery tracking application.
273. 🆕 Design the frontend for a social media stories/reels feature.

---

## 20. Advanced Trade-offs & Meta Questions

274. Edge vs browser vs server logic — decision framework.
275. SPA vs MPA trade-offs.
276. Locale-specific UI structure.
277. Privacy vs personalization.
278. Class → Hooks migration.
279. Browser API deprecation handling.
280. Secure plugin marketplaces.
281. Marketing vs performance balance.
282. Designing for sudden 10× traffic.
283. On-device ML personalization.
284. 🆕 Build vs buy decision framework for frontend infrastructure.
285. 🆕 How do you evaluate and adopt new frontend frameworks/libraries at an org level?
286. 🆕 Strangler fig pattern for incremental frontend rewrites.
287. 🆕 React vs meta-frameworks (Next.js, Remix, Astro) — when to use what.
288. 🆕 Technical debt vs feature velocity — how to make the case for refactoring.
289. 🆕 Designing frontend architecture for acqui-hire / acquisition integration.
290. 🆕 Frontend architecture for progressive web-to-native migration.
291. 🆕 How would you future-proof a frontend architecture for the next 3-5 years?

---

## 21. AI, LLM & Emerging Tech in Frontend 🆕

292. 🆕 Architecture for integrating LLM-powered features (chat, summarization, search) into existing frontends.
293. 🆕 Streaming LLM responses — UI rendering, error handling, and cancellation.
294. 🆕 Designing frontend for AI-generated content moderation and safety.
295. 🆕 On-device AI inference architecture using WebGPU / WebNN.
296. 🆕 Architecture for prompt management and AI feature flagging.
297. 🆕 Frontend design for retrieval-augmented generation (RAG) interfaces.
298. 🆕 Designing conversational UIs — state management, context windows, and multi-turn flows.
299. 🆕 AI copilot integration in product UIs — inline suggestions, autocomplete, and smart defaults.
300. 🆕 Architecture for A/B testing AI models behind the same frontend.
301. 🆕 WebXR / AR frontend architecture and interaction design.

---

## 22. Video, Media & Rich Content 🆕

302. 🆕 Video player architecture — adaptive bitrate, DRM, and custom controls.
303. 🆕 Architecture for a media upload pipeline (images, video, audio) with processing status.
304. 🆕 Real-time audio/video processing in the browser (WebRTC, MediaStream API).
305. 🆕 Canvas/WebGL rendering architecture for data-intensive visualizations.
306. 🆕 Rich text editor architecture (Slate, ProseMirror, TipTap) — extensibility and collaboration.
307. 🆕 Architecture for PDF viewing, annotation, and generation in the browser.
308. 🆕 Designing a frontend for a content creation studio (image editing, video editing).
309. 🆕 Lazy media loading and intersection observer architecture at scale.

---

## How to Use This Document

- Treat each question as a **15–45 minute** structured discussion
- Always cover: **Requirements → Constraints → Architecture diagram → Trade-offs → Failure scenarios → Metrics & rollout**
- Questions marked 🆕 fill gaps in AI/LLM integration, media architectures, emerging patterns, and additional interview prompts
- Use **Section 19** (Interview-Style HLD Prompts) for mock interview practice — these are the most commonly asked format
- **Sections 21–22** cover emerging topics increasingly asked in 2025–2026 interviews
- Perfect for system-design rounds at product companies (FAANG, startups, and everything in between)

---

## Summary

| Metric | Count |
|--------|-------|
| Total Categories | 22 |
| Original Questions | 200 |
| New Questions Added | 109 |
| **Total Questions** | **309** |

---

*End of Document*
