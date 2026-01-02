import { DataTypes, Model } from "sequelize";
import sequelize from "@/lib/db_connection";

class UserDetail extends Model {
  declare id: number;
  declare ordenNumber: number;
  declare name: number;
  declare lastName: string;
  declare document: string;
  declare email: string;
  declare phone: string;
  declare cellPhone: string;
  declare description: string;
  declare total: number;
}

UserDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ordenNumber: {
      type: new DataTypes.DOUBLE(),
      allowNull: false,
    },
    name: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    lastName: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    document: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    email: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    phone: {
      type: new DataTypes.STRING(),
      allowNull: true,
    },
    cellPhone: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    description: {
      type: new DataTypes.STRING(),
      allowNull: false,
    },
    total: {
      type: new DataTypes.DOUBLE(),
      allowNull: false,
    },
  },
  {
    tableName: "user_details",
    sequelize,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

export default UserDetail;
