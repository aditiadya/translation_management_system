import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const RolePermission = sequelize.define(
  "RolePermission",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "permissions",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "role_permissions",
    indexes: [
      {
        unique: true,
        fields: ["role_id", "permission_id"],
      },
    ],
  }
);

RolePermission.associate = (models) => {
  if (models.Roles) {
    RolePermission.belongsTo(models.Roles, {
      foreignKey: "role_id",
      as: "role",
    });
  }
  if (models.Permissions) {
    RolePermission.belongsTo(models.Permissions, {
      foreignKey: "permission_id",
      as: "permission",
    });
  }
};

export default RolePermission;
