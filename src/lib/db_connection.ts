import { SequelizeOptions } from "sequelize-typescript";
import { options } from "../../server/config/config.mjs";
import { Sequelize } from "sequelize";

const dbOptions = <SequelizeOptions>options;
dbOptions.dialectModule = require("mysql2");

dbOptions.ssl = true;
dbOptions.dialectOptions = {
  ssl: {
    rejectUnauthorized: false,
  },
};

const sequelize = new Sequelize(dbOptions);

export default sequelize;
