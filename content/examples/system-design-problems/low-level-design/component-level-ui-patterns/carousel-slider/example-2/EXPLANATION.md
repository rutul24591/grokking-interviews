# Design a Carousel / Slider - example-2 Explanation

## Article context
This example supports the article `low-level-design/component-level-ui-patterns/carousel-slider`. The article is about Carousel with touch support, velocity-based swiping, FLIP animation, autoplay, accessibility, lazy-loaded slides, and infinite loop.. The most relevant article sections for this example are: Clarifying the Requirements; The Slide State Model; Touch and Pointer Event Handling; FLIP Animation for Slide Transitions; Virtualization for Large Slide Sets; Autoplay and Pause Logic; Accessibility: ARIA and Keyboard Model; Keyboard Navigation Within the Carousel; Responsive Design and Slide Counts; Interview Q&A.

## What this example demonstrates
This example turns the article concept into a concrete implementation artifact. Read it as a small production-style slice rather than an isolated snippet: the files show the domain model, execution path, supporting configuration, tests or demo harness, and operational assumptions that make the article easier to apply in real systems.

## How it supports the article
The example reinforces the article by showing how the concept behaves when data moves through real boundaries: inputs are accepted, state or decisions are derived, outputs are returned, and failures are handled or surfaced. For interview preparation, connect each file back to the article sections above and explain why the implementation choices match the article's trade-offs.

## File-by-file walkthrough
- `autoplay-visibility.ts`: Implements the main logic, including useAutoplayWithVisibility, timerRef, isUserInteractingRef, next, resetAutoplay.

## Execution and data flow
Start from the app, demo, server, route, or run file when present. That entrypoint wires together the supporting modules, executes the main scenario, and prints or renders the result. Domain or model files define the entities. API, route, client, store, policy, config, or utility files express the boundaries and rules. README or notes files explain how to run or inspect the example locally.

## Important implementation behavior
- timeout and deadline handling
- asynchronous or event-driven flow
- offline, reconnect, resume, or sync behavior
- empty, missing, or null-state handling

## Edge cases and failure modes
- Slow dependencies need explicit timeouts and caller-visible failure semantics.
- Asynchronous work can arrive late, out of order, or more than once.
- Reconnect and resume flows need conflict handling and progress recovery.
- Empty, missing, or null data should produce intentional UI or service states.

## How to use this example
Use the README if present, then inspect the entrypoint and supporting modules in order. While reading, ask: what invariant is being protected, what boundary can fail, what state can become stale or inconsistent, and what metric or assertion would prove the example works under load or failure?

## Interview value
This example is useful for mid-level, senior, staff, and principal interviews because it gives concrete language for implementation trade-offs. A strong answer should explain the happy path, the failure path, the operational signals, and the reason the design supports the article's core idea.
