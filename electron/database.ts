import type { Repository } from 'typeorm'
import path from 'node:path'
import { DataSource } from 'typeorm'
import { User } from './entities/User'

export const AppDataSource = new DataSource({
  synchronize: true,
  logging: true,
  type: 'better-sqlite3',
  database: 'database.db',
  entities: [User],
  nativeBinding: path.join(path.dirname(__dirname), 'dist-native/better_sqlite3.node'),
})

export class DatabaseManager {
  private static instance: DatabaseManager
  private connection: DataSource | null = null

  private constructor() { }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }

    return DatabaseManager.instance
  }

  public async connect(): Promise<DataSource> {
    if (!this.connection) {
      this.connection = await AppDataSource.initialize()
    }

    return this.connection
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.destroy()
      this.connection = null
    }
  }

  public async getRepository<T>(entity: { new(): T }): Promise<Repository<T>> {
    await this.connect()

    return this.connection.getRepository(entity)
  }
}
