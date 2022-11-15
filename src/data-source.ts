
import "reflect-metadata"
import { DataSource } from "typeorm"
import { Category } from "./entity/Category"
import { Photo } from "./entity/Photo"
import { Product } from "./entity/Product"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "myweb",
    synchronize: true,
    logging: false,
    entities: [User,Product,Category,Photo],
    migrations: [],
    subscribers: [],
})
