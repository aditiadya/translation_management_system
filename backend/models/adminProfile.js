import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import AdminAuth from "./adminAuth.js";

const AdminProfile = sequelize.define(
  "AdminProfile",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AdminAuth,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    setup_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "admin_profile",
    timestamps: true,
  }
);

AdminProfile.associate = (models) => {
  if (models.AdminAuth) {
    AdminProfile.belongsTo(models.AdminAuth, {
      foreignKey: "admin_id",
      as: "admin",
    });
  }
};

export default AdminProfile;
