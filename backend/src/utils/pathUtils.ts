// utils/getPath.ts
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Käytetään eri rootia jos NODE_ENV on 'test'
const isTestEnv = process.env.NODE_ENV === 'test';
const rootDir = isTestEnv
  ? path.resolve(__dirname, '../../tests')
  : path.resolve(__dirname, '..');

export const getPath = (...paths: string[]): string => {
  return path.join(rootDir, ...paths);
};
