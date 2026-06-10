import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

function resolveBaseUrl(): string {
  if (process.env.BASE_URL) return process.env.BASE_URL;
  const env = (process.env.TTA_ENV || 'QA').toLowerCase();
  switch (env) {
    case 'dev':
    case 'local':
      return process.env.DEV_BASE_URL || 'https://www.saucedemo.com';
    case 'stg':
    case 'stage':
    case 'staging':
      return process.env.STG_BASE_URL || 'https://staging.saucedemo.com';
    case 'production':
      return process.env.PROD_BASE_URL || 'https://www.saucedemo.com';
    case 'QA':
    default:
      return process.env.QA_BASE_URL || 'https://www.saucedemo.com';
  }
}
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './src/tests',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 4 : undefined,
  reporter: [
    ['./src/utils/CustomReporter'],
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['allure-playwright', { outputFolder: 'allure-results/report' }],
    ['junit', { outputFile: 'test-results.xml' }],
    ['list']
  ],
  use: {
    baseURL: resolveBaseUrl(),
    trace: 'on',
    screenshot: 'on',
    video: 'on',
    actionTimeout: 30_000,
    navigationTimeout: 45_000,
    // The demo site is served over HTTP/3 (QUIC); Chromium's QUIC connection
    // intermittently dies with net::ERR_QUIC_PROTOCOL_ERROR on the first
    // navigation. Disable QUIC so it falls back to TCP (HTTP/1.1 / HTTP/2).
    launchOptions: {
      args: ['--disable-quic'],
    },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    // { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
});
