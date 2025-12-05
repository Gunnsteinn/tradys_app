import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/db_connection";

class PickUp extends Model {
  declare id: number;
  declare from: string;
  declare package: number;
  declare package_plus2: number;
  declare package_plus5: number;
  declare pallet: number;
  declare type: string;
}

PickUp.init(
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
    package: {
      type: new DataTypes.DOUBLE(),
      allowNull: false,
    },
    package_plus2: {
      type: new DataTypes.DOUBLE(),
      allowNull: false,
    },
    package_plus5: {
      type: new DataTypes.DOUBLE(),
      allowNull: false,
    },
    pallet: {
      type: new DataTypes.DOUBLE(),
      allowNull: false,
    },
    type: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
  },
  {
    tableName: "pick_up_rate",
    sequelize,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

export default PickUp;
