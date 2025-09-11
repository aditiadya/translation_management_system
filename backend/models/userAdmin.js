import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const UserAdmin = sequelize.define(
  "UserAdmin",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_auth",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_auth",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "user_admin",
    indexes: [
      {
        unique: false,
        fields: ["user_id"],
      },
      {
        unique: false,
        fields: ["admin_id"],
      },
    ],
  }
);

export default UserAdmin;
