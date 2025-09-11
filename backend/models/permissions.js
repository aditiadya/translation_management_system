import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Permissions = sequelize.define(
  "Permissions",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    module: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "permissions",
  }
);

Permissions.associate = (models) => {
  if (models.Roles && models.RolePermission) {
    Permissions.belongsToMany(models.Roles, {
      through: models.RolePermission,
      foreignKey: "permission_id",
      otherKey: "role_id",
      as: "roles",
    });
  }
};

export default Permissions;