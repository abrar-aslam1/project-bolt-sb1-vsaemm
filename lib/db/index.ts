import { Database } from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

class DB {
  private db: Database;

  constructor() {
    // Use absolute path to ensure database is found regardless of where the code is executed
    const dbPath = path.resolve(process.cwd(), 'local.db');
    this.db = new Database(dbPath);
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async run(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(error) {
        if (error) {
          reject(error);
        } else {
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }

  async get(sql: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (error, row) => {
        if (error) {
          reject(error);
        } else {
          resolve(row);
        }
      });
    });
  }
}

// Create a singleton instance
const db = new DB();
export { db };
