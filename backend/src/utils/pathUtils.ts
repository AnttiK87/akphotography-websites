import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

export const getPath = (...paths: string[]): string => {
  return path.join(rootDir, ...paths);
};
