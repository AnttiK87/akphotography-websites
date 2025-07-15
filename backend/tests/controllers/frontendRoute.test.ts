import { jest } from '@jest/globals';
import path from 'path';
import fs from 'fs';
import request from 'supertest';

const mockFilePath = path.join(process.cwd(), 'tests', 'mockIndex.html');

// 🔁 Luo tiedosto ennen moduulien importointia
fs.writeFileSync(mockFilePath, '<html><body>Mock Index</body></html>');

// 🧪 Mock getPath ennen app-importtia
jest.unstable_mockModule('../../src/utils/pathUtils.js', () => ({
  __esModule: true,
  getPath: () => mockFilePath,
}));

// 💡 Vasta tämän jälkeen import app
const { default: app } = await import('../../src/app.js');

afterAll(() => {
  fs.unlinkSync(mockFilePath); // 🧹 Siivous
});

describe('GET * route', () => {
  it('should serve index.html from getPath', async () => {
    const res = await request(app).get('/anything');

    expect(res.status).toBe(200);
    expect(res.text).toContain('Mock Index');
  });
});
