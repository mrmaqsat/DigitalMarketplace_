import { beforeAll, afterAll } from 'vitest';
import { vi } from 'vitest';

beforeAll(() => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.MONGODB_URI = 'mongodb://localhost:27017/digitalmarketplace_test';
  process.env.SESSION_SECRET = 'test-session-secret';
  process.env.STRIPE_SECRET_KEY = 'sk_test_fake_stripe_key';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_fake_webhook_secret';
});

afterAll(() => {
  // Clean up
  vi.clearAllMocks();
});
