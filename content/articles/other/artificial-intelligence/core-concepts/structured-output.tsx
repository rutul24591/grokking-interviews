"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import { HighlightBlock } from "@/components/articles/HighlightBlock";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-other-ai-structured-output",
  title:
    "Structured Output — JSON Mode, Function Calling, and Constrained Generation",
  description:
    "Comprehensive guide to structured output covering JSON mode, function calling APIs, constrained decoding with Outlines and Guidance, schema validation, retry strategies for parse failures, and reliability patterns for extracting structured data from LLMs.",
  category: "other",
  subcategory: "artificial-intelligence",
  slug: "structured-output",
  wordCount: 5500,
  readingTime: 22,
  lastUpdated: "2026-05-15",
  tags: [
    "ai",
    "structured-output",
    "json-mode",
    "function-calling",
    "constrained-generation",
  ],
  relatedTopics: ["prompting", "agents", "rag", "ai-application-architecture"],
};

export default function ArticlePage() {
  return (
    <ArticleLayout metadata={metadata}>
      <section>
        <h2>Definition &amp; Context</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: structured output is a reliability contract between
          your LLM call and the downstream system that consumes the result.
          The key design variables are parse failure rate (target under 1%),
          schema complexity (simpler is more reliable), and the choice of
          mechanism — JSON mode, schema-constrained API, or constrained
          decoding — each offering a different point on the reliability vs
          model support vs latency trade-off curve.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>Structured output</strong> refers to the practice of
          instructing a language model to produce output in a machine-readable
          format — typically JSON — rather than free-form text. It is the
          bridge between the probabilistic, unstructured nature of language
          model outputs and the strict, typed expectations of downstream systems:
          databases, APIs, agent tool calls, UI components, and data pipelines.
          Without structured output mechanisms, every LLM response requires
          fragile regex parsing or natural language post-processing, both of
          which fail unpredictably in production.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The spectrum of structured output approaches ranges from weakest to
          strongest guarantee:{" "}
          <strong>prompt engineering alone</strong> (ask the model to produce
          JSON — unreliable, 10 to 30% parse failure rate without careful
          prompting),{" "}
          <strong>JSON mode</strong> (constrain output to valid JSON syntax —
          1 to 5% failure rate on required field presence),{" "}
          <strong>schema-constrained output</strong> (enforce field presence,
          types, and enums — under 0.1% failure rate),{" "}
          <strong>constrained decoding</strong> (intercept logits to guarantee
          schema compliance at the token level — near-zero parse failures, but
          requires local model access). Choosing the right point on this spectrum
          requires understanding your model provider, latency budget, quality
          requirements, and operational complexity tolerance.
        </HighlightBlock>
        <p>
          Structured output becomes critical as soon as an LLM response feeds
          into any downstream programmatic system. A chatbot that returns free
          text to a human can tolerate occasional format variation — the human
          adapts. A document processing pipeline that extracts entities into a
          database cannot: a missing field or wrong type crashes the ingestion
          job. An agent that produces tool call arguments as a structured schema
          must be correct every time — a malformed tool call either fails silently
          or triggers incorrect actions. The cost of parse failure is not just
          a user-facing error; in agentic systems, it can mean lost context,
          wasted token budget, or cascading failures across downstream steps.
        </p>
        <p>
          For software engineers building AI-powered products, understanding
          structured output mechanisms is essential for building reliable
          pipelines. The field has matured significantly since 2023: what
          previously required elaborate prompt engineering and retry loops
          can now be handled declaratively by specifying a JSON Schema, with
          the API provider guaranteeing compliance. But the tradeoffs —
          latency overhead, model support limitations, schema design
          constraints — require careful consideration for every production
          deployment.
        </p>
      </section>

      <section>
        <h2>Core Concepts</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: understand the three mechanisms at a mechanistic
          level — JSON mode constrains tokenization but not schema, the
          structured output API uses server-side schema enforcement, and
          constrained decoding uses logit masking via a finite state machine.
          Explain which guarantees each provides and when each breaks down.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          <strong>JSON mode</strong> works by instructing the model&apos;s
          sampling algorithm to only generate tokens that would produce valid
          JSON. Under the hood, providers like OpenAI implement this by
          tracking JSON parse state at each decode step and rejecting tokens
          that would produce invalid JSON syntax (e.g., an unescaped quote
          inside a string, or a comma after the last property in an object).
          The guarantee is narrow: the output will be valid JSON. It will not
          guarantee that required fields are present, that values match expected
          types, or that string fields conform to expected patterns. You must
          still validate the parsed JSON against your schema after receiving it.
          JSON mode is appropriate when your downstream code is tolerant of
          optional fields or when you are using the model for flexible extraction
          where the schema varies per request.
        </HighlightBlock>
        <p>
          <strong>The structured output API</strong> (called{" "}
          <code>response_format: &#123;type: &quot;json_schema&quot;&#125;</code>{" "}
          in OpenAI&apos;s API and implemented via tool use in Anthropic&apos;s
          API) extends JSON mode with schema enforcement. The provider validates
          that all required fields are present, that values match declared types,
          and that enum fields contain only allowed values. This is implemented
          server-side by the provider — the model is fine-tuned or prompted
          in a way that makes schema compliance very reliable, and the provider
          post-validates before returning the response. If the model produces
          a non-compliant response internally, the provider retries silently
          before returning to the client. The result is a parse failure rate
          under 0.1% for well-designed schemas, making it suitable for
          production pipelines. The limitation: schema support varies by model
          (OpenAI gpt-4o and later, Anthropic via tool use, Gemini 1.5 Pro
          and later) and imposes a 5 to 15 ms latency overhead.
        </p>
        <p>
          <strong>Function calling</strong> (also called tool use) is the
          structured output mechanism built for agent architectures. Instead
          of asking the model to produce JSON in the response body, you define
          a set of tools as JSON Schema objects and the model produces a
          structured tool call object when it decides a tool should be invoked.
          The key capabilities: parallel tool calls (the model can invoke
          multiple tools in one response), forced tool calls (you can require
          the model to use a specific tool, useful for extraction pipelines),
          and multi-turn tool results (you inject the tool execution result
          back into the conversation and the model continues reasoning). Function
          calling is the most expressive structured output mechanism because it
          integrates naturally with agent loops and supports complex schemas
          with nested objects and arrays.
        </p>
        <p>
          <strong>Constrained decoding</strong> is the strongest guarantee and
          works at the token level. Libraries like Outlines and Guidance
          intercept the logit distribution produced by the model at each decode
          step and apply a binary mask: tokens that would violate the current
          grammar state are set to negative infinity (effectively zero
          probability after softmax), so the model can only sample tokens that
          keep the output on a valid path through the grammar. A JSON Schema
          is compiled into a finite state machine (FSM): each state represents
          a position in the JSON document, and transitions represent valid
          next tokens. The vocabulary is pre-indexed against the FSM at startup
          (a one-time cost per schema), so each masking operation during
          inference is a fast lookup rather than a re-evaluation. The result
          is structural correctness guaranteed by construction — no retries
          needed. The limitation: constrained decoding requires access to the
          model&apos;s logit layer, which means it only works with locally
          hosted open-weights models, not cloud API models.
        </p>
      </section>

      <section>
        <h2>Architecture &amp; Flow</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: describe the full pipeline — prompt construction,
          LLM call with schema, raw output, parse, validate, retry loop,
          typed object, downstream consumer — and identify exactly where each
          failure mode occurs and how to handle it.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          The production structured output pipeline has six stages. First,
          prompt construction: the system prompt includes schema context and
          field-level instructions that guide the model toward correct output.
          Second, the LLM call with schema specification (JSON mode, structured
          output API, or tool use). Third, raw output reception (streaming
          or complete). Fourth, JSON parsing (syntactic validation). Fifth,
          schema validation against your Pydantic or Zod model. Sixth, typed
          object delivery to the downstream consumer. Failures at stages four
          and five trigger the retry loop, which re-sends the request with
          additional context about what went wrong.
        </HighlightBlock>

        <ArticleImage
          src="/diagrams/other/artificial-intelligence/structured-output-architecture.svg"
          alt="Structured output architecture showing JSON mode, function calling, constrained decoding, validation and retry mechanisms"
          caption="Structured Output Architecture — output methods, function calling, constrained decoding, and validation &amp; retry strategy"
        />

        <p>
          Schema design is the highest-leverage investment in a structured output
          pipeline. The field descriptions inside a JSON Schema are not just
          documentation for human readers — the model reads them at inference
          time and uses them to interpret ambiguous inputs. A field named{" "}
          <code>status</code> with no description will be filled based on the
          model&apos;s prior about what &quot;status&quot; means in the context
          of the document. A field named <code>status</code> with the
          description &quot;The current processing state of the invoice: one
          of paid, pending, overdue, or cancelled&quot; will be filled
          correctly even for unusual document formats. Enum constraints should
          be used wherever the value set is finite and known — they both guide
          the model and allow the validator to reject unexpected values.
          Avoid deeply nested schemas (more than three levels): the model&apos;s
          accuracy degrades with nesting depth, and the retry cost of
          getting a deeply nested structure wrong is high.
        </p>
        <p>
          Wiring function calling into an agent loop requires careful handling
          of the tool result injection pattern. After the model produces a
          tool call, your code executes the tool and produces a result. This
          result must be injected back into the conversation as a message with
          role <code>tool</code> (OpenAI) or <code>user</code> with a
          tool_result block (Anthropic). The model then continues from where
          it left off, incorporating the tool result into its reasoning. For
          parallel tool calls, all tool results must be injected in the same
          turn before continuing — partial injection causes the model to
          lose context about which tools it called. Schema versioning for
          tool calls follows the same discipline as API versioning: never
          make breaking changes (removing required fields, changing field
          types) to a schema in production without a coordinated migration.
          Use semantic versioning on your tool schemas and inject the version
          identifier in the tool name (e.g.,{" "}
          <code>extract_invoice_v2</code>) to allow gradual rollout.
        </p>
        <p>
          Streaming responses add complexity to structured output parsing.
          When the model streams a JSON response, you receive a sequence of
          partial tokens that do not form valid JSON until the full response
          arrives. The naive approach — buffering all tokens and parsing at
          the end — works but prevents you from acting on partial results.
          Streaming JSON parsers (like{" "}
          <code>partial-json</code> in JavaScript or{" "}
          <code>jiter</code> in Python) can parse partial JSON and expose
          completed sub-objects as they arrive. This is useful for progressive
          UI rendering (show each extracted entity as it is completed rather
          than waiting for the full document). For agents, prefer non-streaming
          tool calls to simplify error handling — the additional latency from
          buffering is usually acceptable compared to the complexity of
          streaming partial tool arguments.
        </p>
      </section>

      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: frame the comparison as reliability vs flexibility
          vs cost vs model support. JSON mode is the most flexible and cheapest
          but least reliable. Constrained decoding is the most reliable but
          requires local model access. Structured output API is the sweet spot
          for cloud-hosted model pipelines.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          JSON mode has a parse failure rate of 1 to 5% for required field
          presence and type correctness (even with valid JSON, the model may
          omit required fields or use the wrong type). Structured output API
          reduces this to under 0.1% for well-designed schemas. Constrained
          decoding brings structural failures to near zero, but does not
          eliminate semantic failures (the model can produce a correctly
          structured object with wrong field values). Every approach still
          requires business logic validation beyond the schema.
        </HighlightBlock>
        <p>
          Latency overhead varies significantly across approaches. Prompt-only
          structured output (asking in the system prompt to return JSON) adds
          no API overhead but has the highest failure rate. JSON mode adds
          negligible overhead (5 to 10ms) on top of the base model latency.
          Structured output API adds 10 to 20ms for schema validation and
          potential silent retries. Constrained decoding adds 10 to 30ms
          per token for FSM state lookup (though this is partially offset by
          reduced retry cost). For latency-sensitive applications where TTFT
          is critical (real-time voice interfaces, interactive UIs), the
          overhead of constrained decoding may be prohibitive; the structured
          output API is usually the better choice.
        </p>
        <p>
          Model support is the practical differentiator for many teams. JSON
          mode is supported by virtually all major model providers (OpenAI,
          Anthropic, Google, Mistral, Cohere). Structured output with strict
          schema enforcement is supported by OpenAI (gpt-4o and later),
          Anthropic (via tool use), and Google (Gemini 1.5 Pro and later).
          Constrained decoding only works with open-weights models you control
          directly. If your organization uses multiple model providers (for
          fallback, cost optimization, or capability routing), you need a
          structured output abstraction layer that normalizes across provider
          APIs — libraries like Instructor (Python) and Vercel AI SDK
          (TypeScript) provide this.
        </p>
      </section>

      <section>
        <h2>Best Practices</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: the highest-impact best practice is writing rich
          field-level descriptions in your schema. The second is monitoring
          parse failure rate as a production health metric with alerting when
          it exceeds 1%. Both are often neglected.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Every field in a production JSON Schema should have a description
          that explains what the field represents in the context of the input
          document, not just its data type. Treat schema field descriptions
          as prompt engineering: they are the instructions the model receives
          at inference time for how to fill each field. A schema with no
          descriptions performs significantly worse than the same schema with
          precise, example-anchored descriptions — the difference can be 10
          to 30 percentage points in field accuracy on ambiguous inputs.
        </HighlightBlock>
        <p>
          Test your schemas with adversarial inputs before production deployment.
          Adversarial inputs for structured output testing include: documents
          where a required field is absent in the source material (does the
          model hallucinate a value or correctly return null?), documents with
          multiple plausible values for a field (does the model pick
          consistently?), documents in unusual formats (tables, bullet lists,
          embedded code), and edge cases at enum boundaries (a status value
          that is close to but not exactly one of the declared enum options).
          Maintain a test suite of 50 to 100 labeled examples per schema and
          run it automatically when you change the schema or switch model
          versions.
        </p>
        <p>
          Monitor parse failure rate as a first-class production metric.
          Instrument your validation layer to emit a counter for every
          successful parse, every parse failure (with the failure reason and
          schema field that failed), and every retry attempt. Track the retry
          rate separately from the failure rate: a high retry rate with a low
          final failure rate indicates a schema or prompt issue that is being
          masked by retries at extra cost. Set alert thresholds: page at 5%
          retry rate or 0.5% final failure rate. Log the raw model output and
          the specific validation error for every failure — this data is
          essential for iterating on schema design and diagnosing model
          regression when providers update model weights.
        </p>
      </section>

      <section>
        <h2>Common Pitfalls</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: the three most common production failures are
          schema too complex causing model truncation, missing field descriptions
          causing systematic misclassification, and forgetting to handle
          partial JSON from streaming responses.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Schema complexity is inversely correlated with model accuracy.
          A schema with 20 required fields, 4 levels of nesting, and complex
          conditional logic will have significantly higher parse failure rates
          than a flat schema with 5 well-described fields. When you find
          yourself designing a complex schema, split it into multiple
          sequential LLM calls: extract the top-level fields first, then make
          a second call to extract nested details for each top-level entity.
          This decomposition improves accuracy, makes debugging easier, and
          allows partial results to be useful even if one extraction step
          fails.
        </HighlightBlock>
        <p>
          Missing or vague field descriptions cause systematic misclassification
          that is hard to detect without labeled evaluation data. The model
          will fill ambiguous fields based on statistical priors from training
          data, which may not match your domain-specific semantics. For example,
          a field named <code>category</code> in an expense report schema
          without a description will be filled using the model&apos;s general
          understanding of &quot;category&quot; — which may not match your
          company&apos;s expense category taxonomy at all. This type of error
          is systematic (it affects all inputs, not random ones) and only
          discovered during evaluation against labeled data. The fix is to
          enumerate allowed values with descriptions of each, preferably with
          one or two examples of what input text maps to each value.
        </p>
        <p>
          Partial JSON from streaming responses is a subtle failure mode.
          When you use streaming with structured output and the model produces
          a 2,000-token JSON object, you receive 2,000 token chunks. If you
          attempt to parse the JSON before the final chunk arrives, you will
          get a parse error. More subtly: if the streaming connection drops
          mid-response (network timeout, server-side error), you have a partial
          JSON object that you must either discard or attempt to complete via
          a non-streaming retry. Always implement a streaming timeout: if
          no new tokens arrive within a configurable window (e.g., 5 seconds),
          consider the stream complete and attempt to parse what you have.
          Log the raw buffer contents on any parse failure for debugging.
          For agent tool calls specifically, do not execute a tool until the
          complete tool call object has been received — partial tool arguments
          lead to unpredictable tool behavior.
        </p>
      </section>

      <section>
        <h2>Real-World Use Cases</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: anchor structured output use cases in the downstream
          consumer, not just the extraction task. Who reads the structured
          data, and what happens if a field is wrong or missing? That answer
          drives the required reliability level.
        </HighlightBlock>
        <HighlightBlock as="p" tier="important">
          Document entity extraction — pulling structured data from unstructured
          documents (invoices, contracts, medical records, emails) — is the
          most common enterprise use case for structured output. The downstream
          consumer is a database or ERP system that requires exact field
          names and types. A missing required field (e.g., invoice_total is
          null) either blocks ingestion or causes a silent data quality issue.
          The production reliability requirement is typically 99%+ parse success
          rate with 95%+ field accuracy, requiring a combination of structured
          output API, schema field descriptions, and a human-in-the-loop review
          queue for low-confidence extractions.
        </HighlightBlock>
        <p>
          Agent tool results are the most reliability-critical structured output
          use case. When an agent calls a tool — a database query, an API
          call, a code execution — the tool result is injected back into the
          conversation as structured data that the agent uses to plan its next
          action. If the tool result schema is misspecified (e.g., the status
          field uses different enum values in the result vs. the original tool
          schema), the agent may misinterpret the result and take incorrect
          follow-on actions. The fix: define result schemas with the same
          rigor as input schemas, validate outgoing tool results against the
          schema before injecting them into the agent context, and use typed
          result objects in code rather than passing raw JSON strings.
        </p>
        <p>
          Classification with confidence scores is a use case where structured
          output enables capabilities that pure text output cannot provide.
          Instead of asking the model to return a single label, you ask it to
          return a structured object with a predicted_class (enum), a
          confidence (float 0-1), and a reasoning (string). The confidence
          field enables downstream routing: high-confidence predictions go
          directly to the output, low-confidence ones trigger a human review
          queue or a fallback to a more capable model. Structured output is
          essential here — confidence is useless if it arrives as free text
          that requires parsing. Form population from natural language (e.g.,
          &quot;Schedule a meeting with Sarah next Tuesday at 2pm&quot; →
          structured calendar event with attendees, start_time, end_time,
          and title) is another common use case where structured output
          eliminates a fragile parsing layer between the LLM and the
          application&apos;s data model.
        </p>
      </section>

      <section>
        <h2>Common Interview Questions with Detailed Answers</h2>
        <HighlightBlock as="p" tier="crucial">
          Interview focus: answer with constraints, decisions, trade-offs, and
          how you&apos;d validate or operate the system. Avoid describing
          features without explaining why they matter for the specific problem.
        </HighlightBlock>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q1: What is the difference between JSON mode and the structured
            output API? When would you use each?
          </h3>
          <HighlightBlock as="p" tier="important">
            This tests whether you understand what each mechanism actually
            guarantees. The answer is not just &quot;one is stricter&quot; —
            explain the mechanism and the failure modes.
          </HighlightBlock>
          <p>
            JSON mode guarantees valid JSON syntax but nothing about the content.
            If you specify a schema with 10 required fields, JSON mode will
            return valid JSON but may omit fields, use wrong types, or invent
            unexpected additional keys. The guarantee is purely syntactic.
            You still need to validate the response against your schema after
            parsing and handle field-level failures.
          </p>
          <p>
            The structured output API (OpenAI&apos;s{" "}
            <code>json_schema</code> response format or Anthropic&apos;s tool
            use) guarantees that required fields are present, that values match
            their declared types, and that enum values are within the allowed
            set. The provider enforces this server-side with silent retries.
            Use JSON mode when your schema is loose or variable (different
            documents need different fields), or when you need to support
            models that don&apos;t implement the strict API. Use the structured
            output API for production pipelines where missing fields cause
            downstream failures — the 0.1% vs 3-5% failure rate difference
            is significant at scale.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q2: Design a document entity extraction pipeline with 99%+
            parse success rate and 95%+ field accuracy for processing
            10,000 invoices per day.
          </h3>
          <HighlightBlock as="p" tier="important">
            Structure your answer: schema design, model choice, validation
            and retry strategy, and quality monitoring. Mention the human
            review queue for edge cases.
          </HighlightBlock>
          <p>
            Start with schema design: define a flat schema (max 2 levels of
            nesting) with required fields for invoice_number, vendor_name,
            invoice_date, due_date, line_items (array), subtotal, tax, and
            total. Every field gets a description with examples drawn from
            your actual invoice formats. Use enum for currency_code (ISO
            4217 codes) and payment_status. Provide two or three few-shot
            examples in the system prompt showing diverse invoice formats
            mapping to the schema.
          </p>
          <p>
            Use the OpenAI structured output API (gpt-4o) with retry logic:
            attempt 1 is the standard call; attempt 2 appends the specific
            validation error to the prompt (&quot;The previous response was
            missing the required field invoice_date. The invoice date appears
            in the document as...&quot;); attempt 3 uses a simpler schema
            extracting only the highest-priority fields. For invoices that
            fail all three attempts (target: under 1% of volume), route to
            a human review queue. Monitor field-level accuracy weekly by
            sampling 200 invoices and comparing against human-verified ground
            truth. Track parse_success_rate, field_accuracy per field, and
            retry_rate per attempt in your metrics dashboard.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q3: How does constrained decoding work at the token level?
            Explain the finite state machine approach used by Outlines.
          </h3>
          <HighlightBlock as="p" tier="important">
            This is a mechanistic question. Walk through the FSM compilation
            step and the per-token masking step. Interviewers want to see you
            understand the algorithm, not just the library.
          </HighlightBlock>
          <p>
            Constrained decoding works in two phases: schema compilation and
            inference-time masking. In the compilation phase (done once per
            schema at startup), Outlines converts your JSON Schema into a
            finite state machine where each state represents a valid parse
            position in the JSON document, and transitions represent tokens
            (or sequences of bytes) that advance the state. For example,
            after parsing the opening brace and the key{" "}
            <code>&quot;status&quot;:</code>, the FSM is in a state that only
            allows the enum values you declared as valid options. The full
            model vocabulary (typically 32,000 to 100,000 tokens) is
            pre-indexed against every FSM state to produce a sparse mapping
            from state to allowed token IDs.
          </p>
          <p>
            At inference time, after each token is sampled, the FSM transitions
            to the new state. Before the next token is sampled, Outlines
            retrieves the pre-computed allowed token set for the current state
            and applies a binary mask to the logit vector: disallowed tokens
            are set to negative infinity, so they receive zero probability
            after softmax. The model then samples from the remaining
            distribution. This adds roughly 1 to 5ms per token for the mask
            lookup, plus the one-time compilation overhead of 50 to 200ms
            per schema. The key insight: the model&apos;s generation quality
            is preserved for the allowed tokens — the mask only eliminates
            structurally invalid choices, not semantically poor ones.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q4: How do you version schemas used in production LLM calls?
            What are the risks of schema changes?
          </h3>
          <HighlightBlock as="p" tier="important">
            Schema versioning is API versioning for AI pipelines. Apply the
            same principles: semantic versioning, backward compatibility
            analysis, and migration strategies.
          </HighlightBlock>
          <p>
            Treat JSON Schemas used in production LLM calls as versioned APIs.
            Use semantic versioning: patch versions for description changes that
            don&apos;t affect parsing, minor versions for adding optional fields,
            major versions for adding required fields, removing fields, or
            changing field types or enum values. Store schema versions alongside
            the LLM responses so you can re-parse historical responses when
            schemas evolve. Include the schema version in tool names (e.g.,{" "}
            <code>extract_invoice_v2</code>) and in the Pydantic model class
            name to make version identity explicit in logs.
          </p>
          <p>
            The risks of schema changes in production: adding a required field
            can instantly cause parse failures for any responses in flight or
            cached during a rolling deployment. Removing an enum value can
            cause validation failures if the model was trained to produce
            (or prompted to produce) the removed value. Renaming a field is a
            breaking change even if the semantic meaning is the same —
            downstream consumers reading the old field name get null. The safe
            migration pattern is: add new field as optional → deploy new
            consumer that reads new field if present, old field otherwise →
            migrate prompts to produce new field → remove old field after
            confirming absence from all recent responses.
          </p>
        </div>

        <div className="my-6 rounded-lg bg-panel-soft p-6">
          <h3 className="mb-3 text-lg font-semibold">
            Q5 (Staff/Principal): Design a multi-step agentic workflow where
            each step produces typed outputs, step failures are handled
            gracefully without losing context, and the system can resume
            from a checkpoint after partial completion.
          </h3>
          <HighlightBlock as="p" tier="important">
            This requires combining structured output, error handling, state
            management, and observability into a coherent architecture. Show
            that you think about failure modes at every step, not just the
            happy path.
          </HighlightBlock>
          <p>
            The architecture has three layers: a typed step definition layer,
            an execution engine with checkpointing, and an error handling
            strategy. Each workflow step is defined as a typed function with
            an input schema (Pydantic model), an output schema, a maximum
            retry count, and a fallback strategy. The execution engine
            persists the state after each successful step to a durable store
            (Postgres or Redis with TTL). State includes: the workflow ID,
            the step index, all completed step outputs (typed), the full
            conversation history (for LLM context), and any error records
            from failed attempts.
          </p>
          <p>
            When a step fails (parse error, validation error, or tool execution
            error), the engine implements a three-tier recovery strategy. Tier
            1: retry with the error message appended to the prompt — &quot;Your
            previous response for step 3 (extract_entities) was invalid because
            the field entity_type contained the value &apos;organization&apos;
            which is not in the allowed enum. Valid values are: person,
            company, location, date. Please retry.&quot; The model sees the
            specific failure and corrects it in most cases. Tier 2: simplify
            the step — break it into two sub-steps (e.g., extract entity names
            first, then classify each). Tier 3: skip the step with a structured
            null result and continue with downstream steps that don&apos;t
            depend on the failed output — track the skip in the workflow state
            so human review can complete the missing field later.
          </p>
          <p>
            The conversation history management is critical for long workflows.
            Each step receives not the full conversation history (which grows
            unboundedly) but a compressed context: the original user goal,
            a summary of completed steps and their typed results, and the
            full detail of the immediately preceding step. This prevents context
            window overflow while preserving the information the model needs to
            reason coherently. Implement a typed context object (not a raw
            string) that serializes to a consistent format for the LLM and
            validates that all prior step outputs are structurally intact before
            passing to the next step. Every step execution emits a trace span
            (OpenTelemetry) with the step name, schema version, attempt count,
            success/failure, and the structured output (redacted if it contains
            PII). This trace is essential for debugging production failures in
            multi-step workflows where the root cause of a step-5 failure often
            originates in a flawed step-2 output.
          </p>
        </div>
      </section>

      <section>
        <h2>References</h2>
        <ul className="space-y-2 text-sm text-muted">
          <li>
            OpenAI.{" "}
            <a
              href="https://platform.openai.com/docs/guides/structured-outputs"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Structured Outputs Guide&quot;
            </a>{" "}
            — OpenAI Platform Docs, 2024
          </li>
          <li>
            Anthropic.{" "}
            <a
              href="https://docs.anthropic.com/en/docs/build-with-claude/tool-use"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Tool Use (Function Calling)&quot;
            </a>{" "}
            — Anthropic Developer Docs, 2024
          </li>
          <li>
            Lhoest et al.{" "}
            <a
              href="https://github.com/dottxt-ai/outlines"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Outlines: Structured Text Generation&quot;
            </a>{" "}
            — GitHub, dottxt-ai, 2023
          </li>
          <li>
            Willard &amp; Louf.{" "}
            <a
              href="https://arxiv.org/abs/2307.09702"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Efficient Guided Generation for Large Language Models&quot;
            </a>{" "}
            — arXiv, 2023
          </li>
          <li>
            Liu et al.{" "}
            <a
              href="https://python.useinstructor.com"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Instructor: Structured LLM Outputs&quot;
            </a>{" "}
            — instructor library, 2024
          </li>
          <li>
            Google.{" "}
            <a
              href="https://ai.google.dev/gemini-api/docs/structured-output"
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              &quot;Structured Output with Gemini&quot;
            </a>{" "}
            — Google AI for Developers, 2024
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
