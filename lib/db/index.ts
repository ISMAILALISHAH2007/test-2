import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL

let _db: ReturnType<typeof drizzle> | null = null
let _pool: Pool | null = null

export function getDb() {
  if (!_db) {
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set')
    }
    _pool = new Pool({ connectionString })
    _db = drizzle(_pool, { schema })
  }
  return _db
}

export function getPool() {
  if (!_pool) {
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set')
    }
    _pool = new Pool({ connectionString })
    _db = drizzle(_pool, { schema })
  }
  return _pool
}

// Lazy initialization
let _initialized = false

export function initDb() {
  if (!_initialized && connectionString) {
    try {
      _pool = new Pool({ connectionString })
      _db = drizzle(_pool, { schema })
      _initialized = true
    } catch (e) {
      // Silently fail
    }
  }
}

// Initialize on module load if DATABASE_URL is available
if (connectionString && !_initialized) {
  initDb()
}

export const db = _db || { $client: null }
export const pool = _pool || null

export default getDb
