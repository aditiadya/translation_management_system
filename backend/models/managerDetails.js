import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ManagerDetails = sequelize.define(
  "ManagerDetails",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    auth_id: {
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
    client_pool_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "client_pools",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    teams_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zoom_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    can_login: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "manager_details",
    timestamps: true,
    indexes: [
      { fields: ["admin_id"] },
      { fields: ["auth_id"] },
      { fields: ["client_pool_id"] },
    ],
  }
);

ManagerDetails.associate = (models) => {
  ManagerDetails.belongsTo(models.AdminAuth, {
    foreignKey: "admin_id",
    as: "admin",
    onDelete: "CASCADE",
  });

  ManagerDetails.belongsTo(models.AdminAuth, {
    foreignKey: "auth_id",
    as: "auth",
    onDelete: "CASCADE",
  });

  ManagerDetails.hasOne(models.UserRoles, {
    foreignKey: "auth_id",
    sourceKey: "auth_id",
    as: "role",
    onDelete: "CASCADE",
  });

  ManagerDetails.belongsTo(models.ClientPool, {
    foreignKey: "client_pool_id",
    as: "client_pool",
    onDelete: "SET NULL",
  });
};

export default ManagerDetails;
