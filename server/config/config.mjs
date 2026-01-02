/* eslint-disable import/no-anonymous-default-export */
import dotenv from "dotenv";
dotenv.config();

export const options = {
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || "railway",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  dialect: process.env.DB_DIALECT || "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};

export default {
  development: options,
  test: options,
  production: options,
};
