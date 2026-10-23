import { Sequelize, Dialect } from "sequelize";

export const sequelize = new Sequelize({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME ?? "",
  username: process.env.DB_USER ?? "",
  password: process.env.DB_PASSWORD ?? "",
  dialect: (process.env.DB_DIALECT ?? "postgres") as Dialect,
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
});
