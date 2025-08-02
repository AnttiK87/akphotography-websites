import { getPath } from '../../src/utils/pathUtils.js';
import path from 'path';

describe('getPath', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  test('returns path with test root when NODE_ENV is test', () => {
    process.env.NODE_ENV = 'test';

    const result = getPath('some', 'path');

    expect(path.normalize(result)).toContain(
      path.normalize('backend/tests/some/path'),
    );
  });

  test('returns path with normal root when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';

    const result = getPath('some', '/public_html/uploads');

    expect(path.normalize(result)).toContain(
      path.normalize('some/public_html/some/uploads'),
    );
  });
});
