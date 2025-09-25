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

    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_auth",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "client_pools",
    timestamps: true,
    indexes: [{ fields: ["name"] }],
  }
);

ClientPool.associate = (models) => {
  ClientPool.belongsTo(models.AdminAuth, {
    foreignKey: "admin_id",
    as: "admin",
  });

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
