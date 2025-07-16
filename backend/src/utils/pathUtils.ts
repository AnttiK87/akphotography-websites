// utils/getPath.ts
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getPath = (...paths: string[]): string => {
  const isTestEnv = process.env.NODE_ENV === 'test';
  const rootDir = isTestEnv
    ? path.resolve(__dirname, '../../tests')
    : path.resolve(__dirname, '../../../');
  return path.join(rootDir, ...paths);
};
