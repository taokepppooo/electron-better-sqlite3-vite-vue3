import path from 'node:path'
import { DataSource } from "typeorm"

const root = import.meta.env.VITE_COMMAND === 'serve'
  ? import.meta.env.VITE_DEV_ROOT
  : path.join(__dirname, '..')

export const AppDataSource = new DataSource({
    synchronize: true, 
    logging: true,
    type: "better-sqlite3",
    database: "database.db",
    entities: ['./entities/*.ts'],
    nativeBinding: path.join(root, import.meta.env.VITE_BETTER_SQLITE3_BINDING)
})