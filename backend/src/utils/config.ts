// config.ts is used to load environment variables from a .env file and export them as typed constants.
import * as dotenv from 'dotenv';

// choose the .env file based on the environment
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
// Load environment variables from .env file
dotenv.config({ path: envFile });

// export typed environment variables
export const PORT: number = Number(process.env.PORT) || 3000;
export const MYSQL_USER: string = process.env.MYSQL_USER!;
export const MYSQL_ROOT_PASSWORD: string = process.env.MYSQL_ROOT_PASSWORD!;
export const MYSQL_PASSWORD: string = process.env.MYSQL_PASSWORD!;
export const MYSQL_DATABASE: string = process.env.MYSQL_DATABASE!;
export const DB_HOST: string = process.env.DB_HOST!;
export const SECRET: string = process.env.SECRET!;
export const ADMIN_PASSWORD: string = process.env.ADMIN_PASSWORD!;
