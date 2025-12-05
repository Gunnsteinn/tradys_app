import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/db_connection";

class Rate extends Model {
  declare id: number;
  declare rate: number;
  declare from: string;
  declare to: string;
  declare weight: string;
  declare rate_city: number;
  declare rate_ring1: number;
  declare rate_ring2: number;
  declare rate_ring3: number;
}

Rate.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    from: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    to: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    weight: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    rate_city: {
      type: new DataTypes.DOUBLE(),
      allowNull: false,
    },
    rate_ring1: {
      type: new DataTypes.DOUBLE(),
      allowNull: false,
    },
    rate_ring2: {
      type: new DataTypes.DOUBLE(),
      allowNull: false,
    },
    rate_ring3: {
      type: new DataTypes.DOUBLE(),
      allowNull: false,
    },
  },
  {
    tableName: "rate",
    sequelize,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

export default Rate;
