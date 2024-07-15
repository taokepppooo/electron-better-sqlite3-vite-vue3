import path from 'node:path'
import Database from 'better-sqlite3'

const root = import.meta.env.VITE_COMMAND === 'serve'
  ? import.meta.env.VITE_DEV_ROOT
  : path.join(__dirname, '..')
let database: Database.Database

export function getSqlite3(filename: string) {
  return database ??= new Database(filename, {
    nativeBinding: path.join(root, import.meta.env.VITE_BETTER_SQLITE3_BINDING),
  })
}
