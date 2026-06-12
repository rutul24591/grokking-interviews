# StreamingMarkdownRenderer: recovery scenario

This example models the failure case where a network chunk ended inside a fenced code block containing raw HTML. The recovery plan is explicit: retain the incomplete suffix, sanitize only the complete parsed prefix, and append the block after its closing fence arrives.
