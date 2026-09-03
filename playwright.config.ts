import { defineConfig, devices } from '@playwright/test';

const fullSuite = /.*\.spec\.ts/;
const crossBrowserSmoke = /cross-browser-smoke\.spec\.ts/;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [['line'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
    : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'desktop-chromium', testMatch: fullSuite, use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', testMatch: fullSuite, use: { ...devices['Pixel 7'] } },
    { name: 'desktop-firefox', testMatch: crossBrowserSmoke, use: { ...devices['Desktop Firefox'] } },
    { name: 'desktop-webkit', testMatch: crossBrowserSmoke, use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-webkit', testMatch: crossBrowserSmoke, use: { ...devices['iPhone 13'] } }
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173/personal/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
