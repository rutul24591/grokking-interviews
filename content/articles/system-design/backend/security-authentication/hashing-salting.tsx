"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-backend-hashing-salting-extensive",
  title: "Hashing & Salting",
  description:
    "Staff-level deep dive into password hashing algorithms, salt generation, work factor tuning, GPU/ASIC resistance, and the operational practice of protecting credentials at scale.",
  category: "backend",
  subcategory: "security-authentication",
  slug: "hashing-salting",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-04-04",
  tags: ["backend", "security", "hashing", "passwords", "bcrypt", "argon2"],
  relatedTopics: ["encryption", "multi-factor-authentication", "authentication-vs-authorization"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* ============================================================
          SECTION 1: Definition and Context
          ============================================================ */}
      <section>
        <h2>Definition and Context</h2>
        <p>
          <strong>Hashing</strong> is a one-way cryptographic function that transforms input data (such as a password)
          into a fixed-size output (the hash). Unlike encryption, hashing is irreversible — given the hash, it is
          computationally infeasible to recover the original input. This property makes hashing ideal for password
          storage: the system stores the hash, not the password, and verifies passwords by hashing the candidate and
          comparing it to the stored hash.
        </p>
        <p>
          <strong>Salting</strong> is the practice of adding a unique, random value (the salt) to each password before
          hashing. The salt ensures that identical passwords produce different hashes — if two users have the same
          password, their hashes will differ because their salts differ. Salting prevents rainbow table attacks
          (precomputed tables of password-hash mappings) and ensures that an attacker must brute force each password
          individually rather than cracking multiple passwords simultaneously.
        </p>
        <p>
          Password hashing is the single most important security control for user authentication. If passwords are
          stored in plaintext or hashed with a fast hash function (MD5, SHA-256), a database breach exposes all user
          passwords — attackers can crack millions of passwords per second using GPUs. Proper password hashing
          (bcrypt, Argon2) limits attackers to hundreds or thousands of guesses per second, making large-scale
          password cracking computationally infeasible.
        </p>
        <div className="my-6 rounded-lg border border-theme bg-panel-soft p-5">
          <h3 className="text-lg font-semibold mb-3">Password Hashing vs General-Purpose Hashing</h3>
          <p className="text-muted mb-3">
            <strong>General-purpose hashing (SHA-256, SHA-512):</strong> Designed for speed — millions of hashes per second on commodity hardware. Ideal for data integrity, deduplication, and checksums. Never use for password storage — speed is the enemy of security.
          </p>
          <p className="text-muted mb-3">
            <strong>Password hashing (bcrypt, Argon2, scrypt):</strong> Designed to be slow — hundreds to thousands of hashes per second. Memory-hard (resists GPU/ASIC attacks). Configurable work factor. Built-in salt management. Use exclusively for password storage.
          </p>
          <p>
            <strong>The critical difference:</strong> A fast hash function enables an attacker with a breached database to crack millions of passwords per hour. A slow hash function limits the attacker to dozens of passwords per hour. For a database with millions of passwords, this difference is the difference between a total breach and a contained incident.
          </p>
        </div>
        <p>
          The evolution of password hashing has been an arms race between cryptographers and attackers. Early systems
          used DES-based crypt (truncated to 8 characters, no salt), which was broken by brute force. Unix then moved
          to MD5-based crypt (with salt), which was broken by GPU-accelerated attacks. bcrypt (based on Blowfish)
          introduced a configurable work factor, making it resistant to Moore&apos;s Law — as hardware gets faster, the
          work factor can be increased. Argon2 (the winner of the 2015 Password Hashing Competition) added
          memory-hardness, making it resistant to GPU and ASIC attacks that exploit bcrypt&apos;s low memory usage.
        </p>
        <p>
          Password breaches are the most common source of credential stuffing attacks — attackers use passwords from
          one breach to attempt authentication on other services (since users reuse passwords). Proper password
          hashing limits the damage of a breach — even if the database is compromised, passwords cannot be cracked
          quickly enough to be useful before users change them. Additionally, breached password detection (checking
          user passwords against known breach databases like Have I Been Pwned) should be implemented to prevent
          users from using compromised passwords.
        </p>
      </section>

      {/* ============================================================
          SECTION 2: Core Concepts
          ============================================================ */}
      <section>
        <h2>Core Concepts</h2>
        <p>
          A cryptographic hash function has four essential properties: it is one-way (given the hash, it is
          computationally infeasible to recover the input), deterministic (the same input always produces the same
          output), collision-resistant (it is computationally infeasible to find two different inputs that produce
          the same hash), and it exhibits the avalanche effect (changing one bit of input changes approximately 50
          percent of the output bits). These properties ensure that hashes are unique, unpredictable, and cannot be
          reversed or manipulated.
        </p>
        <p>
          Salt generation is critical for password hashing security. The salt must be unique per password (generated
          using a cryptographically secure random number generator — CSPRNG), at least 128 bits (16 bytes) in length,
          and stored alongside the hash (the salt is not secret — it is needed to verify passwords). The salt ensures
          that identical passwords produce different hashes, preventing rainbow table attacks and ensuring that an
          attacker must brute force each password individually.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/hashing-salting-diagram-1.svg"
          alt="Password hashing flow showing plaintext password, salt generation, hashing with bcrypt/Argon2, and stored hash"
          caption="Password hashing: the user&apos;s password is combined with a unique random salt and hashed using bcrypt or Argon2. The stored result includes the algorithm parameters, salt, and hash. During verification, the same salt and algorithm are used to hash the candidate password and compare."
        />
        <p>
          bcrypt is the most widely used password hashing algorithm. It is based on the Blowfish cipher and applies
          the Eksblowfish key schedule with a configurable work factor (cost parameter). The work factor determines
          the number of iterations (2^cost), so each increment of the cost parameter doubles the computation time.
          bcrypt produces a 184-bit hash and includes the salt, work factor, and hash in a single output string
          (e.g., $2b$12$salt...hash). bcrypt is supported by virtually every programming language and framework,
          making it the default choice for most production systems.
        </p>
        <p>
          Argon2 is the modern successor to bcrypt and the winner of the 2015 Password Hashing Competition. It comes
          in three variants: Argon2d (data-dependent memory access, fastest but vulnerable to side-channel attacks),
          Argon2i (data-independent memory access, resistant to side-channel attacks but slower), and Argon2id
          (hybrid — uses Argon2i for the first pass and Argon2d for subsequent passes, providing the best balance
          of security and performance). Argon2id is the recommended variant for password hashing. Argon2 is
          memory-hard — it requires a configurable amount of memory (default 64 MB) to compute the hash, making it
          resistant to GPU and ASIC attacks that exploit bcrypt&apos;s low memory usage.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/hashing-salting-diagram-2.svg"
          alt="Brute force attack comparison showing hash cracking speeds for MD5, SHA-256, PBKDF2, bcrypt, and Argon2"
          caption="Hash cracking speed: MD5 allows ~100 billion guesses/sec on GPU (cracked in seconds), SHA-256 allows ~10 billion (minutes), PBKDF2 allows ~1 million (hours), bcrypt allows ~1,000 (years), and Argon2 allows ~100 (decades)."
        />
        <p>
          Work factor tuning is the practice of setting the hash computation time to balance security and user
          experience. The work factor should be set so that each hash takes 0.25-0.5 seconds to compute — fast
          enough for a good user experience (login completes in under a second) but slow enough to limit brute force
          attacks (an attacker can only try 2-4 passwords per second per core). As hardware gets faster, the work
          factor should be increased to maintain the same computation time.
        </p>
        <p>
          Password verification works by retrieving the stored hash (which includes the salt and algorithm parameters),
          extracting the salt, hashing the candidate password with the same salt and algorithm, and comparing the
          result to the stored hash. The comparison must be constant-time (taking the same amount of time regardless
          of where the first difference occurs) to prevent timing attacks. All well-tested password hashing libraries
          use constant-time comparison by default.
        </p>
        <p>
          Password policy should complement strong hashing — require minimum length (12+ characters), allow all
          characters (including spaces and Unicode), do not impose maximum length limits (bcrypt has a 72-byte limit,
          Argon2 has no practical limit), and check passwords against known breach databases (Have I Been Pwned,
          k-anonymity API). Password policies should not require complexity rules (uppercase, numbers, symbols) —
          these lead to predictable patterns (Password1!, Welcome2024!) that attackers exploit. Length is the most
          important factor — a 16-character passphrase is stronger than an 8-character complex password.
        </p>
      </section>

      {/* ============================================================
          SECTION 3: Architecture and Flow
          ============================================================ */}
      <section>
        <h2>Architecture and Flow</h2>
        <p>
          The password hashing architecture consists of the hashing library (bcrypt, Argon2), the salt generator
          (CSPRNG), and the storage layer (database). During registration, the user submits a password, the server
          generates a random salt, hashes the password with the salt using the chosen algorithm, and stores the
          result (algorithm parameters, salt, and hash) in the database. During login, the user submits a password,
          the server retrieves the stored hash, extracts the salt and parameters, hashes the candidate password,
          and compares the result to the stored hash using constant-time comparison.
        </p>
        <p>
          The stored hash format is standardized — for bcrypt, it is $2b$cost$salt+hash (where $2b$ identifies the
          bcrypt variant, cost is the work factor, salt is 22 base64 characters, and hash is 31 base64 characters).
          For Argon2, it is $argon2id$v=19$m=memory,t=iterations,p=parallelism$salt$hash. The stored format includes
          all the information needed to verify a password — the algorithm, parameters, salt, and hash — so the
          verification code does not need to be configured separately.
        </p>
        <ArticleImage
          src="/diagrams/system-design-concepts/backend/security-authentication/hashing-salting-diagram-3.svg"
          alt="Cryptographic hash function properties and comparison of password hashing vs general-purpose hashing"
          caption="Hash properties: one-way, deterministic, collision-resistant, and avalanche effect. Password hashing (bcrypt, Argon2) is slow and memory-hard; general-purpose hashing (SHA-256) is fast and should never be used for passwords."
        />
        <p>
          Work factor rehashing is the practice of upgrading the hash when the work factor is increased. When the
          server verifies a password, it checks whether the stored hash uses the current work factor. If not (the
          work factor was increased since the password was last hashed), the server rehashes the password with the
          new work factor and updates the stored hash. This ensures that all passwords gradually migrate to the
          stronger work factor as users log in, without requiring a bulk rehash operation.
        </p>
        <p>
          Breached password detection is the practice of checking user passwords against known breach databases
          during registration and password change. The system sends a prefix of the password hash (first 5 characters
          of the SHA-1 hash) to the Have I Been Pwned API (using k-anonymity — the server cannot determine which
          password is being checked), and the API returns all hashes with that prefix. The system compares the full
          hash to the returned list and rejects the password if it appears in the breach database. This prevents users
          from using passwords that are already known to attackers.
        </p>
        <p>
          Password migration is the process of upgrading legacy password hashes (plaintext, MD5, SHA-1) to modern
          password hashes (bcrypt, Argon2). The migration happens transparently during login — when the user logs in
          with a legacy hash, the server verifies the password against the legacy hash, and if successful, rehashes
          the password with the modern algorithm and updates the stored hash. This ensures that all passwords are
          gradually migrated to the modern algorithm without requiring users to reset their passwords.
        </p>
      </section>

      {/* ============================================================
          SECTION 4: Trade-offs and Comparison
          ============================================================ */}
      <section>
        <h2>Trade-offs and Comparison</h2>
        <p>
          bcrypt versus Argon2 is the primary trade-off in password hashing algorithm selection. bcrypt is more
          widely supported (available in every programming language and framework), has been battle-tested for over
          25 years, and is simpler to configure (only the work factor needs to be set). Argon2 is more secure
          (memory-hard, resistant to GPU/ASIC attacks), won the 2015 Password Hashing Competition, and is the
          recommended algorithm for new systems. However, Argon2 is less widely supported (not available in all
          languages/frameworks) and requires more configuration (memory, iterations, parallelism).
        </p>
        <p>
          Work factor vs user experience is a trade-off between security and performance. A higher work factor
          increases the hash computation time, making brute force attacks more expensive but also increasing the
          login time for legitimate users. The recommended work factor is one that produces a 0.25-0.5 second hash
          computation time — fast enough for a good user experience but slow enough to limit brute force attacks.
          For high-traffic systems (millions of logins per day), the aggregate CPU cost of hashing can be significant
          — each login requires 0.25-0.5 seconds of CPU time, so a system with 1 million logins per day requires
          250,000-500,000 seconds (70-140 hours) of CPU time for password hashing alone.
        </p>
        <p>
          Memory-hard vs CPU-hard hashing is a trade-off between GPU resistance and resource usage. Memory-hard
          algorithms (Argon2, scrypt) require a configurable amount of memory to compute the hash, making them
          resistant to GPU and ASIC attacks (GPUs have limited memory per core, so they cannot parallelize memory-hard
          algorithms efficiently). However, memory-hard algorithms consume more server resources — each hash requires
          64 MB of memory (Argon2 default), so a server processing 100 concurrent login requests requires 6.4 GB of
          memory for hashing alone. CPU-hard algorithms (bcrypt, PBKDF2) require less memory but are more vulnerable
          to GPU attacks.
        </p>
        <p>
          Client-side hashing versus server-side hashing is a trade-off between security and operational complexity.
          Client-side hashing (the browser hashes the password before sending it to the server) prevents the
          plaintext password from being transmitted over the network, but it does not improve security — the server
          stores the client-side hash, and if the database is breached, the attacker can use the client-side hash to
          authenticate (the client-side hash becomes the effective password). Server-side hashing (the server receives
          the plaintext password and hashes it) is the standard approach — the plaintext password is transmitted over
          HTTPS (encrypted), and the server stores the server-side hash. Client-side hashing should only be used as
          an additional layer (hash client-side, then hash again server-side) — it should not replace server-side
          hashing.
        </p>
      </section>

      {/* ============================================================
          SECTION 5: Best Practices
          ============================================================ */}
      <section>
        <h2>Best Practices</h2>
        <p>
          Use Argon2id for new systems and bcrypt for existing systems. Argon2id is the most secure password hashing
          algorithm available — it is memory-hard, resistant to GPU/ASIC attacks, and was the winner of the 2015
          Password Hashing Competition. If Argon2 is not available in your programming language or framework, use
          bcrypt — it is widely supported, battle-tested, and provides adequate security with proper work factor
          configuration.
        </p>
        <p>
          Configure the work factor to produce a 0.25-0.5 second hash computation time. Benchmark your server
          hardware to determine the appropriate work factor — for bcrypt, cost=12 is a reasonable starting point on
          modern hardware. For Argon2, use the default parameters (memory=64 MB, iterations=3, parallelism=4) and
          adjust based on your server hardware. Re-benchmark periodically as hardware gets faster and increase the
          work factor accordingly.
        </p>
        <p>
          Use unique salts generated by a CSPRNG for each password. Never reuse salts, never derive salts from the
          password or username, and never use a static salt. All well-tested password hashing libraries handle salt
          generation automatically — do not implement your own salt generation.
        </p>
        <p>
          Implement breached password detection — check user passwords against known breach databases (Have I Been
          Pwned, k-anonymity API) during registration and password change. Reject passwords that appear in the breach
          database. This prevents users from using passwords that are already known to attackers.
        </p>
        <p>
          Implement work factor rehashing — when the user logs in, check whether the stored hash uses the current
          work factor. If not, rehash the password with the new work factor and update the stored hash. This ensures
          that all passwords gradually migrate to the stronger work factor as users log in.
        </p>
        <p>
          Implement password migration for legacy hashes — when the user logs in with a legacy hash (MD5, SHA-1,
          plaintext), verify the password against the legacy hash, and if successful, rehash the password with the
          modern algorithm and update the stored hash. This ensures that all passwords are gradually migrated to the
          modern algorithm without requiring users to reset their passwords.
        </p>
      </section>

      {/* ============================================================
          SECTION 6: Common Pitfalls
          ============================================================ */}
      <section>
        <h2>Common Pitfalls</h2>
        <p>
          Using fast hash functions (MD5, SHA-256) for password hashing is a critical security failure. Fast hash
          functions enable attackers to crack millions of passwords per second using GPUs. If passwords are hashed
          with MD5 or SHA-256, a database breach exposes all user passwords within hours. The fix is to use bcrypt
          or Argon2 — slow, memory-hard algorithms that limit attackers to hundreds or thousands of guesses per
          second.
        </p>
        <p>
          Using a static salt (the same salt for all passwords) defeats the purpose of salting. If all passwords use
          the same salt, identical passwords produce identical hashes, enabling rainbow table attacks. The fix is to
          use a unique salt for each password, generated by a CSPRNG. All well-tested password hashing libraries
          handle this automatically.
        </p>
        <p>
          Not increasing the work factor as hardware gets faster is a common operational pitfall. A work factor that
          produces a 0.5 second hash computation time today will produce a 0.25 second hash computation time in 2
          years (due to Moore&apos;s Law), and a 0.12 second hash computation time in 4 years. The fix is to re-benchmark
          periodically (annually) and increase the work factor to maintain the 0.25-0.5 second computation time.
        </p>
        <p>
          Storing passwords in plaintext or reversible encryption is a critical security failure. If passwords are
          stored in plaintext, a database breach exposes all user passwords immediately. If passwords are stored
          with reversible encryption, the attacker can decrypt all passwords if the encryption key is obtained. The
          fix is to use one-way hashing (bcrypt, Argon2) — passwords cannot be recovered from the hash, even if the
          database is breached.
        </p>
        <p>
          Not implementing breached password detection is a common oversight. Users reuse passwords across services,
          so a breach at one service exposes passwords at other services. If the system does not check passwords
          against breach databases, users can register with or continue to use compromised passwords. The fix is to
          implement breached password detection using the Have I Been Pwned API (k-anonymity) during registration
          and password change.
        </p>
      </section>

      {/* ============================================================
          SECTION 7: Real-world Use Cases
          ============================================================ */}
      <section>
        <h2>Real-world Use Cases</h2>
        <p>
          A large e-commerce platform uses bcrypt with cost=12 for password hashing — each password hash takes
          approximately 0.3 seconds to compute on their server hardware. The platform implements work factor
          rehashing — when the cost factor is increased (from 12 to 13), users are automatically rehashed with the
          new cost factor when they log in. The platform also implements breached password detection using the Have I
          Been Pwned API — passwords that appear in the breach database are rejected during registration and password
          change. The platform has had zero successful credential-stuffing attacks since implementing these controls.
        </p>
        <p>
          A financial services company uses Argon2id with memory=64 MB, iterations=3, parallelism=4 for password
          hashing — each password hash takes approximately 0.4 seconds to compute. The company enforces a minimum
          password length of 14 characters (no complexity requirements) and checks all passwords against the Have I
          Been Pwned API. The company migrated from MD5-based hashes to Argon2id using transparent migration — when
          users logged in with MD5-based hashes, the server verified the password against the MD5 hash and rehashed
          it with Argon2id. The migration completed within 6 months as all active users logged in.
        </p>
        <p>
          A healthcare organization uses bcrypt with cost=13 for password hashing — each password hash takes
          approximately 0.6 seconds to compute (longer than typical due to HIPAA compliance requirements). The
          organization enforces a minimum password length of 12 characters, checks all passwords against the Have I
          Been Pwned API, and implements account lockout after 5 failed login attempts. The organization monitors
          login attempts and alerts on anomalous patterns (multiple failed attempts from the same IP, login attempts
          from unusual locations).
        </p>
        <p>
          A SaaS platform uses Argon2id with memory=128 MB, iterations=4, parallelism=4 for password hashing — each
          password hash takes approximately 0.5 seconds to compute. The platform implements breached password
          detection, work factor rehashing, and password migration (from legacy SHA-256 hashes to Argon2id). The
          platform also implements a password strength meter that estimates password entropy (based on length and
          character diversity) and provides real-time feedback during registration — encouraging users to choose
          longer, more secure passwords.
        </p>
      </section>

      {/* ============================================================
          SECTION 8: Interview Questions
          ============================================================ */}
      <section>
        <h2>Interview Questions</h2>

        <div className="space-y-5">
          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 1: Why can&apos;t you use SHA-256 for password hashing?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              SHA-256 is designed for speed — it can compute millions of hashes per second on commodity hardware, and billions per second on GPUs. This speed is the enemy of password security — an attacker with a breached database can crack millions of SHA-256-hashed passwords per hour using GPU-accelerated brute force attacks.
            </p>
            <p>
              Password hashing algorithms (bcrypt, Argon2) are designed to be slow — they limit attackers to hundreds or thousands of guesses per second. Additionally, Argon2 is memory-hard, making it resistant to GPU and ASIC attacks that exploit SHA-256&apos;s low memory usage. SHA-256 should never be used for password storage — use bcrypt or Argon2 instead.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 2: What is the difference between bcrypt and Argon2?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              bcrypt is a CPU-hard algorithm based on the Blowfish cipher — it applies a configurable number of iterations (2^cost) to slow down brute force attacks. bcrypt is widely supported, battle-tested for 25+ years, and simple to configure (only the cost parameter needs to be set). However, bcrypt is not memory-hard, making it vulnerable to GPU and ASIC attacks.
            </p>
            <p>
              Argon2 is a memory-hard algorithm that requires a configurable amount of memory to compute the hash, making it resistant to GPU and ASIC attacks. Argon2 won the 2015 Password Hashing Competition and is the recommended algorithm for new systems. However, Argon2 is less widely supported than bcrypt and requires more configuration (memory, iterations, parallelism).
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 3: How do you migrate from a weak hashing algorithm (MD5) to a strong one (Argon2)?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Use transparent migration during login — when the user logs in, verify the password against the legacy hash (MD5). If successful, rehash the password with the strong algorithm (Argon2) and update the stored hash. This migrates passwords transparently as users log in, without requiring a bulk rehash operation or forcing users to reset their passwords.
            </p>
            <p>
              For users who do not log in during the migration period, implement a deadline (e.g., 6 months) after which inactive accounts must reset their passwords. Additionally, implement breached password detection — if a migrated password appears in a breach database, require the user to choose a new password.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 4: What is breached password detection, and how does it work?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Breached password detection checks user passwords against known breach databases (Have I Been Pwned) during registration and password change. It uses the k-anonymity model — the client sends only the first 5 characters of the password&apos;s SHA-1 hash to the API, and the API returns all hashes with that prefix (typically 300-500 hashes). The client compares the full hash to the returned list and determines whether the password has been breached.
            </p>
            <p>
              k-anonymity ensures that the API cannot determine which password is being checked — the API only sees the first 5 characters of the hash, which corresponds to hundreds of passwords. This provides privacy while still enabling breached password detection.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-5">
            <h3 className="text-lg font-semibold mb-3">Question 5: How do you tune the work factor for password hashing?</h3>
            <p className="text-muted mb-3"><strong>Answer:</strong></p>
            <p className="mb-3">
              Benchmark your server hardware to determine the work factor that produces a 0.25-0.5 second hash computation time. For bcrypt, start with cost=12 and adjust up or down based on the benchmark. For Argon2, start with memory=64 MB, iterations=3, parallelism=4 and adjust based on the benchmark.
            </p>
            <p>
              Re-benchmark periodically (annually) as hardware gets faster and increase the work factor to maintain the 0.25-0.5 second computation time. Implement work factor rehashing — when the user logs in, check whether the stored hash uses the current work factor, and if not, rehash the password with the new work factor. This ensures that all passwords gradually migrate to the stronger work factor as users log in.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: References
          ============================================================ */}
      <section>
        <h2>References &amp; Further Reading</h2>
        <ul className="space-y-2">
          <li>
            <a href="https://www.rfc-editor.org/rfc/rfc9106" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              RFC 9106: Argon2 Memory-Hard Function
            </a> — The Argon2 specification.
          </li>
          <li>
            <a href="https://www.usenix.org/conference/usenixsecurity15/technical-sessions/presentation/biryukov" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Password Hashing Competition: Argon2
            </a> — The winning algorithm announcement and analysis.
          </li>
          <li>
            <a href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              OWASP Password Storage Cheat Sheet
            </a> — Comprehensive password hashing best practices.
          </li>
          <li>
            <a href="https://haveibeenpwned.com/API/v3" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Have I Been Pwned API v3
            </a> — k-anonymity breached password detection API.
          </li>
          <li>
            <a href="https://auth0.com/blog/dont-use-sha256-for-password-hashing/" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              Auth0: Don&apos;t Use SHA-256 for Password Hashing
            </a> — Explanation of why fast hashes are insecure for passwords.
          </li>
          <li>
            <a href="https://www.nist.gov/publications/digital-identity-guidelines" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
              NIST SP 800-63B: Digital Identity Guidelines
            </a> — Password policy and hashing recommendations.
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}