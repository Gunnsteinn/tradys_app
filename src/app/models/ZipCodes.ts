import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/db_connection";

class ZipCode extends Model {
  declare id: number;
  declare from: string;
  declare city: string;
  declare region: string;
  declare state: string;
  declare zipCode: number;
  declare lat: string;
  declare lng: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ZipCode.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    city: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    region: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    state: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    zipCode: {
      type: new DataTypes.INTEGER(),
      allowNull: false,
    },
    lat: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    lng: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
  },
  {
    tableName: "zip_code",
    sequelize,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

export default ZipCode;
