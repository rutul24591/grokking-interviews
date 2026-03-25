## CSP — Example 3: Violation reporting endpoint (report-only workflow)

This Node.js server receives CSP violation reports so you can roll out policies safely in **Report-Only** mode.

### Run
```bash
pnpm i
pnpm start
```

Then send a sample report:
```bash
curl -s -X POST http://localhost:4005/csp-report -H 'content-type: application/csp-report' -d '{"csp-report":{"document-uri":"https://example.com","blocked-uri":"inline","violated-directive":"script-src"}}'
```

