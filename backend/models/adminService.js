import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const AdminService = sequelize.define(
  "AdminService",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    active_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    }
  },
  {
    tableName: "admin_services",
    timestamps: false,
  }
);

export default AdminService;
