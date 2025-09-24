import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ClientPoolClients = sequelize.define(
  "ClientPoolClients",
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
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "client_details", key: "id" },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "client_pool_clients",
    timestamps: true,
  }
);

export default ClientPoolClients;