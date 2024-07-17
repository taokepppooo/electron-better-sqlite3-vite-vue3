import path from 'node:path'
import { DataSource } from "typeorm"
import { User } from './entities/User';

export const AppDataSource = new DataSource({
    synchronize: true, 
    logging: true,
    type: "better-sqlite3",
    database: 'database.db',
    entities: [User],
    nativeBinding: path.join(path.dirname(__dirname), 'dist-native/better_sqlite3.node'),
})