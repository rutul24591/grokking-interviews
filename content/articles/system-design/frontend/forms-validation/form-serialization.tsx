"use client";

import { ArticleLayout } from "@/components/articles/ArticleLayout";
import { ArticleImage } from "@/components/articles/ArticleImage";
import type { ArticleMetadata } from "@/types/article";

export const metadata: ArticleMetadata = {
  id: "article-frontend-form-serialization",
  title: "Form Serialization",
  description:
    "Comprehensive guide to Form Serialization covering FormData API, JSON transformation, nested object handling, array serialization, and production-scale data preparation strategies.",
  category: "frontend",
  subcategory: "forms-validation",
  slug: "form-serialization",
  wordCount: 5200,
  readingTime: 20,
  lastUpdated: "2026-04-01",
  tags: [
    "frontend",
    "form serialization",
    "FormData",
    "JSON transformation",
    "data preparation",
    "file uploads",
  ],
  relatedTopics: [
    "form-state-management",
    "file-upload-handling",
    "client-side-validation",
  ],
};

export default function FormSerializationArticle() {
  return (
    <ArticleLayout metadata={metadata}>
      {/* Section 1: Definition & Context */}
      <section>
        <h2>Definition &amp; Context</h2>
        <p>
          <strong>Form serialization</strong> is the process of converting form
          data from its DOM representation into a structured format suitable for
          transmission to a server or further processing. When a user fills out
          a form, their input exists as DOM element values — text in input
          fields, selected options in dropdowns, checked states in checkboxes
          and radio buttons, and files in file inputs. Serialization transforms
          this scattered DOM state into a cohesive data structure: typically
          JSON for modern APIs, <code>application/x-www-form-urlencoded</code>{" "}
          for traditional form submissions, or <code>multipart/form-data</code>{" "}
          for forms with file uploads.
        </p>
        <p>
          The serialization process seems straightforward until edge cases
          emerge. How do you handle nested data structures (address object with
          street, city, zip)? How do you serialize arrays (multiple selected
          values, dynamic field lists)? What about different input types —
          checkboxes that are unchecked don&apos;t appear in the DOM, radio
          buttons require finding the checked one, file inputs need special
          handling, date inputs return strings that may need timezone
          conversion. Multi-step forms compound the problem — do you serialize
          each step independently or accumulate data across steps?
        </p>
        <p>
          The <code>FormData</code> API, introduced as part of the HTML5
          specification, provides a native way to extract form data. Calling{" "}
          <code>new FormData(formElement)</code> creates a FormData object
          containing all form fields with their names as keys. FormData can be
          sent directly via fetch or converted to JSON. However, FormData has
          limitations: all values are strings (losing type information), nested
          structures require naming conventions (<code>address[street]</code>),
          and browser support for FormData iteration is inconsistent in older
          browsers.
        </p>
        <p>
          Modern React applications often bypass FormData entirely, maintaining
          form state as JavaScript objects that are already in a serializable
          format. This approach provides type safety, easier transformation, and
          better handling of complex data structures. The trade-off is that you
          lose the automatic handling of native form elements — you must
          explicitly bind each field to state and ensure the state shape matches
          your API requirements.
        </p>
        <p>
          For staff-level engineers, form serialization involves architectural
          decisions that impact the entire application. Should the frontend send
          data in the exact shape the API expects, or should a transformation
          layer exist? How do you handle API versioning when the backend schema
          changes? How do you serialize forms that have client-only fields
          (fields used for UX but not sent to the server)? These questions
          require thinking about serialization as part of a broader data
          architecture strategy.
        </p>
      </section>

      {/* Section 2: Core Concepts */}
      <section>
        <h2>Core Concepts</h2>
        <ul className="space-y-3">
          <li>
            <strong>FormData API:</strong> The browser&apos;s native API for
            extracting form data. <code>new FormData(formElement)</code>{" "}
            creates an iterable object with all form fields. FormData supports{" "}
            <code>get()</code>, <code>getAll()</code> (for arrays),{" "}
            <code>set()</code>, and <code>append()</code> methods. FormData can
            be sent directly as fetch body (automatically sets
            multipart/form-data content type) or converted to JSON via{" "}
            <code>Object.fromEntries(formData.entries())</code>. Limitations:
            all values are strings, no native nested object support, files
            require special handling.
          </li>
          <li>
            <strong>JSON Serialization:</strong> Converting form data to JSON
            via <code>JSON.stringify()</code>. This is the most common approach
            for modern APIs. JSON preserves types (numbers, booleans, null),
            supports nested objects and arrays natively, and is universally
            supported. The challenge is transforming DOM values into the desired
            JSON structure — date strings need parsing, checkbox unchecked
            state needs explicit handling, and nested structures require custom
            transformation logic.
          </li>
          <li>
            <strong>URL-Encoded Format:</strong> The traditional{" "}
            <code>application/x-www-form-urlencoded</code> format represents
            form data as <code>key1=value1&amp;key2=value2</code>. This is the
            default for HTML form submissions. Arrays are represented as{" "}
            <code>key[]=value1&amp;key[]=value2</code> or{" "}
            <code>key=value1&amp;key=value2</code>. Nested objects use bracket
            notation: <code>user[name]=john&amp;user[email]=john@example.com</code>.
            Most backend frameworks automatically parse this format, but it
            lacks type information and doesn&apos;t support complex nested
            structures well.
          </li>
          <li>
            <strong>Multipart Form Data:</strong> The{" "}
            <code>multipart/form-data</code> encoding is required for forms with
            file uploads. Each field becomes a separate &quot;part&quot; with
            its own headers. Files are transmitted as binary data within their
            part. Multipart encoding is larger than URL-encoded (due to
            boundary markers and headers) but is the only way to transmit files
            in a form submission. Modern APIs often prefer sending files
            separately (to object storage) and including only file URLs in the
            JSON payload.
          </li>
          <li>
            <strong>Type Preservation:</strong> Form inputs return strings, but
            your API may expect numbers, booleans, or dates. Serialization must
            transform types: empty strings to null, &quot;true&quot;/&quot;false&quot;{" "}
            strings to booleans, numeric strings to numbers, ISO date strings to
            Date objects. This transformation can happen during serialization
            (custom serialize function) or after (transformation pipeline).
            Schema validation libraries (Zod, Yup) can help by parsing and
            validating in one step.
          </li>
          <li>
            <strong>Nested Object Serialization:</strong> Flat form fields must
            be transformed into nested objects. Input names like{" "}
            <code>address.street</code>, <code>address.city</code>,{" "}
            <code>address.zip</code> should become{" "}
            <code>{"{ address: { street, city, zip } }"}</code>. This
            transformation requires parsing field names and building the nested
            structure. Libraries like lodash&apos;s <code>set()</code> can help,
            or you can implement a custom unflatten function.
          </li>
          <li>
            <strong>Array Serialization:</strong> Multiple values for the same
            field (checkbox groups, multi-select dropdowns, dynamic field lists)
            must be serialized as arrays. FormData&apos;s{" "}
            <code>getAll(fieldName)</code> returns all values for a field. For
            dynamic lists (user adds multiple phone numbers), each item needs a
            unique index: <code>phones[0].number</code>,{" "}
            <code>phones[1].number</code>. Serialization must collect these into
            an array structure.
          </li>
          <li>
            <strong>Conditional Serialization:</strong> Not all form fields
            should be sent to the server. Client-only fields (password
            confirmation, UI state) should be excluded. Conditional fields
            (show additional info if checkbox is checked) should only be
            included when relevant. Serialization logic must filter and
            conditionally include fields based on business rules.
          </li>
        </ul>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/forms-validation/form-serialization/nested-structure-transformation.svg"
          alt="Nested Structure Transformation showing flat field names to nested object conversion"
          caption="Nested structure transformation — flat field names (user.address.city) parsed and converted to nested objects; transformation algorithm with key splitting and path traversal"
          width={900}
          height={500}
        />
      </section>

      {/* Section 3: Architecture & Flow */}
      <section>
        <h2>Architecture &amp; Flow</h2>
        <p>
          Form serialization architecture consists of several stages: extraction
          (getting values from the DOM or state), transformation (converting
          types, building nested structures), validation (ensuring data matches
          expected schema), and encoding (producing the final serialized
          format). Each stage can be customized based on requirements.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/forms-validation/form-serialization/serialization-pipeline.svg"
          alt="Form Serialization Pipeline showing extraction, transformation, validation and encoding stages"
          caption="Serialization pipeline — extraction from DOM/state, transformation with type conversion and nested object building, validation against schema, encoding to JSON/FormData/URL-encoded"
          width={900}
          height={550}
        />

        <p>
          The serialization pipeline diagram shows how raw form data flows
          through each stage. Extraction pulls values from FormData or React
          state. Transformation handles type conversion, nested object building,
          and array collection. Validation ensures the transformed data matches
          the expected schema. Encoding produces the final output format (JSON,
          FormData, URL-encoded).
        </p>

        <h3>FormData vs Direct Object Serialization</h3>
        <p>
          Two primary approaches exist for serializing forms in React
          applications. The <strong>FormData approach</strong> extracts data
          from the DOM using the FormData API, then transforms it. This works
          well for uncontrolled components and progressive enhancement (forms
          work without JavaScript). The <strong>Direct Object approach</strong>{" "}
          maintains form state as a JavaScript object that&apos;s already
          structured correctly. This is common with controlled components and
          form libraries like React Hook Form.
        </p>

        <h3>Handling Complex Data Structures</h3>
        <p>
          Real-world forms often have complex data structures that don&apos;t
          map directly to flat form fields. Nested objects (user.profile.name,
          user.profile.avatar), arrays (multiple phone numbers, dynamic
          skill lists), and mixed types (dates, numbers, booleans) require
          careful serialization logic.
        </p>
        <p>
          The key is establishing naming conventions and transformation rules.
          Dot notation (<code>user.profile.name</code>) or bracket notation
          (<code>user[profile][name]</code>) indicates nesting. Array indices
          (<code>phones[0].number</code>) or append semantics
          (<code>phones[].number</code>) indicate arrays. The serialization
          layer parses these conventions and builds the appropriate data
          structure.
        </p>
      </section>

      {/* Section 4: Trade-offs & Comparison */}
      <section>
        <h2>Trade-offs &amp; Comparison</h2>
        <p>
          Serialization approach decisions involve trade-offs between
          simplicity, flexibility, and type safety.
        </p>

        <ArticleImage
          src="/diagrams/system-design-concepts/frontend/forms-validation/form-serialization/formdata-vs-direct-object.svg"
          alt="Comparison of FormData vs Direct Object serialization approaches"
          caption="FormData vs Direct Object comparison — FormData extracts from DOM then transforms, Direct Object maintains structured state; pros/cons and use case recommendations"
          width={900}
          height={500}
        />

        <h3>FormData vs JSON Serialization</h3>
        <p>
          <strong>FormData</strong> is ideal for file uploads (required for
          multipart encoding), progressive enhancement (forms work without
          JavaScript), and simple forms where string values are acceptable.
          FormData is automatically constructed by the browser for native form
          submissions. The downside is type loss (everything is a string),
          verbose syntax for manipulation, and inconsistent browser support for
          iteration.
        </p>
        <p>
          <strong>JSON serialization</strong> is ideal for modern APIs, complex
          data structures, and type-sensitive data. JSON preserves types,
          supports nesting natively, and is easy to manipulate. The downside is
          that file uploads require separate handling (can&apos;t include files
          in JSON), and you lose the automatic form extraction that FormData
          provides.
        </p>

        <h3>Client-Side Transformation vs Server-Side Parsing</h3>
        <p>
          <strong>Client-side transformation</strong> sends data in the exact
          shape the API expects. This reduces server-side processing and makes
          the API contract explicit. The downside is that transformation logic
          lives on the client, potentially duplicating logic if multiple clients
          (web, mobile, third-party) consume the same API.
        </p>
        <p>
          <strong>Server-side parsing</strong> sends flat, simple data and lets
          the server transform it. This centralizes transformation logic and
          ensures consistency across clients. The downside is increased server
          complexity and less explicit API contracts.
        </p>

        <h3>Serialization Libraries</h3>
        <ul className="space-y-2">
          <li>
            <strong>Native FormData:</strong> Built into browsers, no
            dependencies. Best for file uploads and simple forms. Limited
            transformation capabilities.
          </li>
          <li>
            <strong>form-serialize (npm):</strong> Lightweight library that
            converts forms to JSON or URL-encoded format. Handles common cases
            well but limited customization.
          </li>
          <li>
            <strong>Custom transformation functions:</strong> Maximum
            flexibility, tailored to your data structures. Requires more code
            and testing but handles edge cases perfectly.
          </li>
          <li>
            <strong>Schema-based (Zod/Yup):</strong> Define schema once, use
            for both validation and transformation. Type inference provides
            TypeScript types. Best for complex forms with strict validation
            requirements.
          </li>
        </ul>
      </section>

      {/* Section 5: Best Practices */}
      <section>
        <h2>Best Practices</h2>
        <ul className="space-y-3">
          <li>
            <strong>Establish Naming Conventions:</strong> Use consistent
            naming for nested fields (<code>user.address.city</code> or{" "}
            <code>user[address][city]</code>). Document the convention and
            ensure both frontend and backend teams follow it. This makes
            transformation logic predictable and maintainable.
          </li>
          <li>
            <strong>Handle Type Conversion Explicitly:</strong> Don&apos;t rely
            on implicit type coercion. Convert empty strings to null,
            &quot;true&quot;/&quot;false&quot; to booleans, numeric strings to
            numbers. Use schema validation libraries to parse and validate in
            one step.
          </li>
          <li>
            <strong>Exclude Client-Only Fields:</strong> Filter out fields that
            shouldn&apos;t be sent to the server (password confirmation, UI
            state, temporary calculation results). Maintain a list of
            server-bound fields or use a schema that defines expected fields.
          </li>
          <li>
            <strong>Handle Files Separately:</strong> For forms with file
            uploads, consider uploading files first (to object storage), then
            including the file URLs in the JSON payload. This separates file
            handling from data submission and simplifies serialization.
          </li>
          <li>
            <strong>Validate Before Serializing:</strong> Run validation before
            serialization to catch errors early. Don&apos;t waste bandwidth
            sending invalid data. Schema validation libraries can validate and
            transform in one pass.
          </li>
          <li>
            <strong>Handle Arrays Consistently:</strong> Decide how arrays will
            be represented (indexed: <code>items[0]</code>,{" "}
            <code>items[1]</code>; or appended: <code>items[]</code>). Ensure
            your serialization logic handles both single values and arrays
            consistently (always send arrays, even for single items, if the API
            expects arrays).
          </li>
          <li>
            <strong>Implement Serialization Tests:</strong> Test serialization
            logic with edge cases: empty fields, special characters, very long
            values, nested structures, arrays with varying lengths. Automated
            tests catch regressions when form structures change.
          </li>
        </ul>
      </section>

      {/* Section 6: Common Pitfalls */}
      <section>
        <h2>Common Pitfalls</h2>
        <ul className="space-y-3">
          <li>
            <strong>Unchecked Checkboxes Missing:</strong> Unchecked checkboxes
            don&apos;t appear in FormData. If you need to explicitly send{" "}
            <code>false</code> for unchecked checkboxes, use a hidden input
            with the same name before the checkbox, or handle checkboxes
            separately in JavaScript.
          </li>
          <li>
            <strong>Date Timezone Issues:</strong> Date inputs return strings
            in local time (<code>2024-01-15</code>), but APIs often expect UTC
            ISO strings (<code>2024-01-15T00:00:00Z</code>). Failing to handle
            timezone conversion causes off-by-one-day errors. Always convert
            dates to the expected timezone format.
          </li>
          <li>
            <strong>Number Strings vs Numbers:</strong> FormData returns all
            values as strings. Sending <code>&quot;25&quot;</code> instead of{" "}
            <code>25</code> can cause backend validation failures or incorrect
            calculations. Explicitly convert numeric fields.
          </li>
          <li>
            <strong>Array Handling Inconsistency:</strong> Sending a single
            value as a string when the API expects an array (or vice versa)
            causes parsing errors. Always send the expected type — if the API
            expects an array, send <code>[value]</code> even for single items.
          </li>
          <li>
            <strong>File Input Serialization:</strong> Trying to include files
            in JSON (by converting to base64) bloats payload size. Use
            multipart/form-data for files or upload files separately and include
            URLs in JSON.
          </li>
          <li>
            <strong>Special Characters in Field Names:</strong> Field names with
            dots, brackets, or special characters can break transformation
            logic. Use simple, alphanumeric field names and handle nesting in
            transformation logic rather than field names.
          </li>
        </ul>
      </section>

      {/* Section 7: Real-World Use Cases */}
      <section>
        <h2>Real-World Use Cases</h2>

        <h3>E-Commerce Checkout Form</h3>
        <p>
          Checkout forms have nested structures (shipping address, billing
          address, payment info), arrays (multiple items in cart), and mixed
          types (quantities as numbers, dates for delivery). Serialization
          transforms flat form fields into a nested JSON structure matching the
          order API. Files (uploaded proof of address) are handled separately
          via multipart upload. The serialized payload excludes client-only
          fields like &quot;same as shipping&quot; checkbox state.
        </p>

        <h3>User Profile Editor</h3>
        <p>
          Profile forms often have dynamic arrays (skills, social links,
          certifications) where users add/remove items. Serialization collects
          indexed fields (<code>skills[0].name</code>,{" "}
          <code>skills[0].level</code>) into an array. Removed items are
          excluded from serialization. Avatar upload is handled via separate
          file upload, with the resulting URL included in the profile JSON.
        </p>

        <h3>Survey Application</h3>
        <p>
          Survey forms have varying question types (multiple choice, rating
          scales, text responses) that must be serialized into a uniform
          response format. Each question has an ID, type, and response value.
          Serialization transforms diverse input types into a consistent array
          of responses: <code>[{"{"} questionId: 1, type: &quot;rating&quot;,
          value: 4 {"}"}]</code>. Conditional questions (shown based on previous
          answers) are included only if they were rendered.
        </p>
      </section>

      {/* Section 8: Interview Questions & Answers */}
      <section>
        <h2>Common Interview Questions &amp; Detailed Answers</h2>

        <div className="space-y-4">
          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What is the FormData API, and what are its limitations?
            </p>
            <p className="mt-2 text-sm">
              A: FormData is a browser API that extracts form data from form
              elements. You create it with new FormData(formElement), and it
              contains all form fields with their names and values.
            </p>
            <p className="mt-2 text-sm">
              Advantages: Automatically handles all input types, supports file
              uploads (required for multipart/form-data), can be sent directly
              via fetch, works without JavaScript for progressive enhancement.
            </p>
            <p className="mt-2 text-sm">
              Limitations: All values are strings (loses type information), no
              native nested object support (requires naming conventions),
              inconsistent browser support for iteration (forEach not supported
              in older browsers), verbose manipulation API compared to plain
              objects.
            </p>
            <p className="mt-2 text-sm">
              For modern React applications, maintaining form state as
              JavaScript objects often provides better type safety and easier
              transformation, though FormData remains essential for file uploads.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How would you serialize a form with nested objects and arrays?
            </p>
            <p className="mt-2 text-sm">
              A: Nested structures require a naming convention and transformation
              logic.
            </p>
            <p className="mt-2 text-sm">
              Dot notation approach: Use field names like user.address.city to
              indicate nesting. During serialization, split each field name by
              the dot separator and traverse (or create) the nested object
              structure. Set the leaf value at the final key path. This
              transforms flat form data into deeply nested objects.
            </p>
            <p className="mt-2 text-sm">
              For arrays, use indexed notation: phones[0].number, phones[1].number.
              Parse the indices and build arrays during transformation. Libraries
              like lodash provide set() and merge() functions that simplify this
              logic.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle file uploads during form serialization?
            </p>
            <p className="mt-2 text-sm">
              A: Files can&apos;t be included in JSON — they require
              multipart/form-data encoding. Two common approaches:
            </p>
            <p className="mt-2 text-sm">
              Multipart Submission: Use FormData, append files and other fields,
              send via fetch with multipart encoding. Server handles files and
              data together.
            </p>
            <p className="mt-2 text-sm">
              Separate Upload: Upload files first to object storage (S3,
              Cloudinary), get URLs back, then include URLs in the JSON payload.
              This separates concerns and allows progress tracking for large
              files.
            </p>
            <p className="mt-2 text-sm">
              The separate upload approach is more common in modern applications
              — it simplifies the API, enables CDN delivery, and allows
              independent file and data lifecycle management.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: What issues arise with date serialization, and how do you
              handle them?
            </p>
            <p className="mt-2 text-sm">
              A: Date inputs return strings in local time format (2024-01-15),
              but APIs often expect UTC ISO strings. This causes timezone issues
              — a date of &quot;2024-01-15&quot; in New York becomes
              &quot;2024-01-15T05:00:00Z&quot; when converted naively.
            </p>
            <p className="mt-2 text-sm">
              Solutions: (1) Send date-only strings without time (2024-01-15)
              and let the backend interpret as local date. (2) Convert to UTC
              explicitly: new Date(inputValue).toISOString(). (3) Use a date
              library (date-fns, dayjs) with explicit timezone handling.
            </p>
            <p className="mt-2 text-sm">
              The key is consistency — decide on a format (UTC ISO strings are
              most common) and apply it uniformly. Document the expected format
              in your API contract.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle unchecked checkboxes during serialization?
            </p>
            <p className="mt-2 text-sm">
              A: Unchecked checkboxes don&apos;t appear in FormData — the
              browser simply omits them. This is problematic if you need to
              explicitly send false to update a boolean field.
            </p>
            <p className="mt-2 text-sm">
              Solution 1: Hidden Input — Add a hidden input with the same name
              and a false value before the checkbox in the DOM. When the form is
              submitted, both values are sent, but the checkbox value (if
              checked) comes last and overrides the hidden input. If unchecked,
              only the hidden input&apos;s false value is sent.
            </p>
            <p className="mt-2 text-sm">
              Solution 2: JavaScript Handling — Maintain form state in
              JavaScript and explicitly include all boolean fields, regardless
              of checkbox state. This is the approach used by controlled
              component patterns.
            </p>
          </div>

          <div className="rounded-lg border border-theme bg-panel-soft p-4">
            <p className="font-semibold">
              Q: How do you handle serialization of dynamic field lists where
              users can add/remove items (e.g., multiple phone numbers)?
            </p>
            <p className="mt-2 text-sm">
              A: Dynamic field lists require careful indexing to ensure correct
              serialization.
            </p>
            <p className="mt-2 text-sm">
              Indexed naming: Use indexed field names like phones[0].number,
              phones[0].type, phones[1].number. When serializing, parse these
              names and reconstruct the array structure. When items are removed,
              re-index remaining items to avoid gaps.
            </p>
            <p className="mt-2 text-sm">
              Stable IDs: Assign a unique ID to each item when added (not array
              index). Use this ID for React keys and include it in
              serialization. This prevents issues when items are reordered or
              removed — the ID stays with the item.
            </p>
            <p className="mt-2 text-sm">
              Empty array handling: Decide whether to send empty arrays
              (phones: []) or omit the field entirely. Be consistent — if the
              API expects an array, always send an array, even if empty. For
              removal of all items, send an empty array rather than omitting the
              field (which could be ambiguous).
            </p>
          </div>
        </div>
      </section>

      {/* Section 9: References */}
      <section>
        <h2>References</h2>
        <ul className="space-y-2">
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/API/FormData"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN - FormData API
            </a>
          </li>
          <li>
            <a
              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types/multipart/form-data"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              MDN - multipart/form-data
            </a>
          </li>
          <li>
            <a
              href="https://zod.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Zod - Schema Validation and Transformation
            </a>
          </li>
          <li>
            <a
              href="https://lodash.com/docs/#set"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Lodash - set() for Nested Object Building
            </a>
          </li>
        </ul>
      </section>
    </ArticleLayout>
  );
}
