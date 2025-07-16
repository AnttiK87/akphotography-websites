import { getPath } from '../../src/utils/pathUtils.js';

describe('getPath', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  test('returns path with test root when NODE_ENV is test', () => {
    process.env.NODE_ENV = 'test';

    const result = getPath('some', 'path');

    expect(result).toContain('backend\\tests\\some\\path');
  });

  test('returns path with normal root when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';

    const result = getPath('some', '/public_html/uploads');

    expect(result).toContain('some\\public_html\\uploads');
  });
});
