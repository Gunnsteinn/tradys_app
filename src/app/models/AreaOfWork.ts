import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/db_connection";

class AreaOfWork extends Model {
  declare id: number;
  declare deposit: string;
  declare areaOfInfluence: string;
  declare city: string;
  declare state: string;
  declare zipCode: string;
  declare lat: string;
  declare lng: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

AreaOfWork.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    deposit: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    areaOfInfluence: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    city: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    state: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    zipCode: {
      type: new DataTypes.STRING(),
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
    tableName: "area_of_work",
    sequelize,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

export default AreaOfWork;
