import { jest } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import request from 'supertest';

const mockFilePath = path.join(process.cwd(), 'tests', 'mockIndex.html');

fs.writeFileSync(mockFilePath, '<html><body>Mock Index</body></html>');

jest.unstable_mockModule('../../src/utils/pathUtils.js', () => ({
  __esModule: true,
  getPath: () => mockFilePath,
}));

const { default: app } = await import('../../src/app.js');

afterAll(() => {
  fs.unlinkSync(mockFilePath);
});

describe('GET * route', () => {
  test('should serve index.html from getPath', async () => {
    const res = await request(app).get('/anything');

    expect(res.status).toBe(200);
    expect(res.text).toContain('Mock Index');
  });
});
