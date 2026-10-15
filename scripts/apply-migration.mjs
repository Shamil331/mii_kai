/**
 * Applies supabase/migrations/001_nutriday_init.sql via Postgres connection.
 * Needs SUPABASE_DB_PASSWORD in env (Project Settings → Database → Database password)
 * or DATABASE_URL.
 *
 * Usage (from repo root):
 *   node --env-file=frontend/.env scripts/apply-migration.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const sqlPath = path.join(root, 'supabase', 'migrations', '001_nutriday_init.sql')
const sql = fs.readFileSync(sqlPath, 'utf8')

const ref = 'smrcbkjchmdntfbhelff'
const password = process.env.SUPABASE_DB_PASSWORD
const databaseUrl =
  process.env.DATABASE_URL ||
  (password
    ? `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`
    : null)

if (!databaseUrl) {
  console.error(
    'No DATABASE_URL / SUPABASE_DB_PASSWORD.\n' +
      'Open SQL Editor and paste supabase/migrations/001_nutriday_init.sql:\n' +
      `https://supabase.com/dashboard/project/${ref}/sql/new`,
  )
  process.exit(2)
}

const client = new pg.Client({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false },
})

await client.connect()
try {
  await client.query(sql)
  console.log('Migration applied OK')
} finally {
  await client.end()
}
