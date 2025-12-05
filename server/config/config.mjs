/* eslint-disable import/no-anonymous-default-export */
export const options = {
  username: "root",
  password: "HMUnRrKRukUSjpsdFtUekfLCkMDqdenV",
  database: "railway",
  host: "roundhouse.proxy.rlwy.net",
  port: 30380,
  // username: "tradys_db",
  // password: "Tr@dyS.2024!",
  // database: "tradys",
  // host: "localhost",
  // port: 3306,
  dialect: "mysql",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
};

if (process.env.NODE_ENV === "development") {
  options.dialectOptions = {
    ssl: {
      rejectUnauthorized: true,
    },
  };
}

export default {
  development: options,
  test: options,
  production: options,
};
