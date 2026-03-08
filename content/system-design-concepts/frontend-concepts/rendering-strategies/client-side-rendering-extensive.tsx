import Image from "next/image";

export default function CSRDeepDive() {
  return (
    <article className="prose max-w-none">
      {/* ================= ABSTRACT ================= */}
      <h1>Client-Side Rendering (CSR) — Architect Level Deep Dive</h1>

      <p>
        Client-Side Rendering (CSR) is a web architecture model where rendering
        logic executes inside the browser instead of on the server. Modern
        frameworks like React transform the browser into a distributed UI
        runtime responsible for state, rendering, scheduling, and interaction.
      </p>

      {/* ================= CONCISE MODE ================= */}
      <section>
        <h2>🧠 Quick Concise Mode (Interview Recap)</h2>
        <ul>
          <li>
            <strong>Definition:</strong> Browser downloads JS → builds UI
            dynamically.
          </li>
          <li>
            <strong>Benefits:</strong> Fast navigation, rich interactivity.
          </li>
          <li>
            <strong>Problems:</strong> Large JS bundles, CPU pressure, SEO
            complexity.
          </li>
          <li>
            <strong>Architect Insight:</strong> CSR turns the browser into a
            cooperative scheduler.
          </li>
        </ul>
      </section>

      {/* ================= RENDERING PIPELINE ================= */}
      <section>
        <h2>⚙️ Browser Rendering Pipeline</h2>

        <Image
          src="https://webperf.tips/static/d77eb220c5dd10181dc361c4ff0051da/906b5/BrowserRenderingPipeline17.png"
          alt="Browser Rendering Pipeline"
        />

        <p>
          Rendering stages: HTML → DOM → CSSOM → Render Tree → Layout → Paint →
          Composite.
        </p>

        <p>
          Traditional MPA sends full HTML. CSR sends a minimal shell and
          JavaScript builds the UI dynamically.
        </p>

        <pre>
          <code>{`element.style.width = "200px";
console.log(element.offsetWidth); // forces synchronous layout`}</code>
        </pre>
      </section>

      {/* ================= EVENT LOOP ================= */}
      <section>
        <h2>🧵 Event Loop & Scheduling Model</h2>

        <img src="/assets/csr/event-loop.svg" alt="JavaScript Event Loop" />

        <p>
          CSR rendering relies heavily on the JavaScript event loop. Rendering
          occurs between frames after microtasks flush.
        </p>

        <pre>
          <code>{`setState(1);
setState(2); // React batches updates`}</code>
        </pre>
      </section>

      {/* ================= REACT FIBER ================= */}
      <section>
        <h2>⚛️ React Fiber Architecture</h2>

        <img src="/assets/csr/react-fiber.svg" alt="React Fiber Architecture" />

        <p>
          Fiber introduced incremental rendering, priority scheduling, and
          interruptible work.
        </p>

        <ul>
          <li>Render Phase — interruptible</li>
          <li>Commit Phase — atomic</li>
        </ul>

        <pre>
          <code>{`startTransition(() => {
  setData(newData);
});`}</code>
        </pre>
      </section>

      {/* ================= HYDRATION ================= */}
      <section>
        <h2>🧩 Hydration, Partial Hydration & Islands</h2>

        <img
          src="/assets/csr/islands-architecture.svg"
          alt="Islands Architecture"
        />

        <p>
          Hydration attaches JavaScript behavior to server-rendered HTML.
          Partial hydration hydrates only interactive regions.
        </p>

        <ul>
          <li>Navbar → interactive</li>
          <li>Article body → static</li>
        </ul>
      </section>

      {/* ================= PERFORMANCE ================= */}
      <section>
        <h2>🚀 Performance Model (Architect View)</h2>

        <p>
          Main thread timeline: Download JS → Parse → Compile → Execute →
          Render. CSR performance is fundamentally a CPU scheduling problem.
        </p>

        <pre>
          <code>{`useEffect(() => {
  window.addEventListener("resize", handler);
}, []);`}</code>
        </pre>
      </section>

      {/* ================= BUNDLE STRATEGY ================= */}
      <section>
        <h2>📦 Advanced Bundle Strategy</h2>

        <pre>
          <code>{`const Page = lazy(() => import("./Page"));`}</code>
        </pre>

        <ul>
          <li>Route-based splitting</li>
          <li>Component splitting</li>
          <li>Dynamic imports</li>
        </ul>
      </section>

      {/* ================= STREAMING ================= */}
      <section>
        <h2>🌐 Streaming & Edge CSR</h2>

        <p>
          Shell loads → Above-the-fold renders → Heavy components lazy load.
          Edge delivery reduces perceived latency.
        </p>
      </section>

      {/* ================= SECURITY ================= */}
      <section>
        <h2>🔐 Security Architecture</h2>

        <p>Client environment must be treated as untrusted.</p>

        <ul>
          <li>XSS risks</li>
          <li>Token leakage</li>
          <li>Supply chain attacks</li>
        </ul>

        <pre>
          <code>{`localStorage.setItem("token", jwt); // avoid`}</code>
        </pre>
      </section>

      {/* ================= ARCHITECTURE EXAMPLE ================= */}
      <section>
        <h2>🧱 CSR at Scale — Example Architecture</h2>

        <p>
          Next.js SPA (CSR) → Edge CDN → Markdown Content API. Hybrid rendering
          is recommended for SEO.
        </p>
      </section>

      {/* ================= COMPARISON ================= */}
      <section>
        <h2>📊 CSR vs SSR vs RSC</h2>

        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>CSR</th>
              <th>SSR</th>
              <th>RSC</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rendering</td>
              <td>Browser</td>
              <td>Server</td>
              <td>Hybrid</td>
            </tr>
            <tr>
              <td>JS Size</td>
              <td>Large</td>
              <td>Medium</td>
              <td>Small</td>
            </tr>
            <tr>
              <td>SEO</td>
              <td>Weaker</td>
              <td>Strong</td>
              <td>Strong</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ================= MENTAL MODEL ================= */}
      <section>
        <h2>🧠 Architect Mental Model</h2>
        <p>
          CSR behaves like a cooperative scheduler running inside a constrained
          single-threaded runtime, balancing CPU, memory, network and UX.
        </p>
      </section>

      {/* ================= TAKEAWAYS ================= */}
      <section>
        <h2>🔥 Interview Takeaways</h2>

        <h3>Strengths</h3>
        <ul>
          <li>Rich interactivity</li>
          <li>SPA navigation</li>
          <li>Reduced server load</li>
        </ul>

        <h3>Challenges</h3>
        <ul>
          <li>Main-thread CPU pressure</li>
          <li>Memory growth</li>
          <li>SEO complexity</li>
          <li>Security exposure</li>
        </ul>
      </section>
    </article>
  );
}
