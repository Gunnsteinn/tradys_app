import { SequelizeOptions } from "sequelize-typescript";
import { options } from "../../server/config/config.mjs";
import { Sequelize } from "sequelize";
import pg from "pg";

const dbOptions = <SequelizeOptions>options;
dbOptions.dialectModule = pg;

dbOptions.ssl = true;
dbOptions.dialectOptions = {
  ssl: {
    rejectUnauthorized: false,
  },
};

const sequelize = new Sequelize(dbOptions);

export default sequelize;
