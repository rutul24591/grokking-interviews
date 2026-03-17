import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for Interview Prep Studio E2E tests.
 * 
 * Run tests with:
 * - pnpm test:e2e          - Run all tests
 * - pnpm test:e2e:ui       - Run with UI mode
 * - pnpm test:e2e:debug    - Debug mode
 * - pnpm test:e2e:headed   - Run in headed mode (visible browser)
 */
export default defineConfig({
  testDir: "./tests/e2e",
  
  // Timeout for each test
  timeout: 60 * 1000,
  
  // Timeout for each expectation
  expect: {
    timeout: 10 * 1000,
  },
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Number of retries for failed tests
  retries: process.env.CI ? 2 : 0,
  
  // Number of workers for parallel execution
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list", { printSteps: true }],
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL for the application
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    
    // Collect trace on failure for debugging
    trace: "on-first-retry",
    
    // Screenshot on failure
    screenshot: "only-on-failure",
    
    // Video recording
    video: "retain-on-failure",
    
    // Browser context options
    viewport: { width: 1280, height: 720 },
  },
  
  // Configure projects for different browsers
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    
    // Optional: Add more browsers as needed
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],
  
  // Web server configuration for running tests against local dev server
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
