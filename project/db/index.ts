import { drizzle } from 'drizzle-orm/sqlite-proxy';
import { Database } from 'sqlite3';
import * as schema from './schema';

const sqlite = new Database('./local.db');
export const db = drizzle(sqlite, { schema });