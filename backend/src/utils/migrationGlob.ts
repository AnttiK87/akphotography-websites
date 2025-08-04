// src/utils/migrationGlob.ts
import fg from 'fast-glob';
import { getPath } from './pathUtils.js';
import { AppError } from '../errors/AppError.js';

// check if the migration folder has migration files
// and return the glob pattern for Umzug
export const getMigrationGlob = async (): Promise<string> => {
  const env = process.env.NODE_ENV;
  const pattern =
    env === 'test'
      ? getPath('src', 'migrations', '*.ts')
      : env === 'development'
        ? getPath(
            'backend',
            'apps',
            'ak_photography_backend',
            'migrations',
            '*.js',
          )
        : getPath('apps', 'ak_photography_backend', 'migrations', '*.js');

  const files = await fg(pattern, { onlyFiles: true });

  if (files.length === 0) {
    throw new AppError(
      { en: `No migration files found at path: ${pattern}` },
      404,
    );
  }

  return pattern;
};
