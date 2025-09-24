import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ClientPoolManagers = sequelize.define(
  "ClientPoolManagers",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_pool_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "client_pools", key: "id" },
      onDelete: "CASCADE",
    },
    manager_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "manager_details", key: "id" },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "client_pool_managers",
    timestamps: true,
  }
);

export default ClientPoolManagers;