// src/utils/migrationGlob.ts
import fg from 'fast-glob';
import { getPath } from './pathUtils.js';
import { AppError } from '../errors/AppError.js';

const normalizeToUnixPath = (p: string) => p.replace(/\\/g, '/');
// check if the migration folder has migration files
// and return the glob pattern for Umzug
export const getMigrationGlob = async (): Promise<string> => {
  const env = process.env.NODE_ENV;
  const pattern =
    env === 'test' || env === 'development'
      ? getPath(
          env === 'development' ? 'backend' : '',
          env === 'test' ? '../' : '',
          'src',
          'migrations',
          '*.ts',
        )
      : getPath('apps', 'ak_photography_backend', 'migrations', '*.js');

  const path = normalizeToUnixPath(pattern);

  const files = await fg(path, { onlyFiles: true });

  if (files.length === 0) {
    throw new AppError({ en: 'No migration files found!' }, 404);
  }

  return path;
};
