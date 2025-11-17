import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Roles = sequelize.define(
  "Roles",
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
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "roles",
    timestamps: false
  }
);

Roles.associate = (models) => {
  if (models.Permissions && models.RolePermission) {
    Roles.belongsToMany(models.Permissions, {
      through: models.RolePermission,
      foreignKey: "role_id",
      otherKey: "permission_id",
      as: "permissions",
    });
  }
};

export default Roles;