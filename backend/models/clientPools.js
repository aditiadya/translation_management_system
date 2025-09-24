import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ClientPool = sequelize.define(
  "ClientPool",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "client_pools",
    timestamps: true,
    indexes: [{ fields: ["name"] }],
  }
);

ClientPool.associate = (models) => {
  ClientPool.belongsToMany(models.ClientDetails, {
    through: models.ClientPoolClients,
    foreignKey: "client_pool_id",
    otherKey: "client_id",
    as: "clients",
  });

  ClientPool.belongsToMany(models.ManagerDetails, {
    through: models.ClientPoolManagers,
    foreignKey: "client_pool_id",
    otherKey: "manager_id",
    as: "managers",
  });
};

export default ClientPool;