import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const AdminSpecialization = sequelize.define(
  "AdminSpecialization",
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
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    active_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "admin_specializations",
    timestamps: false,
  }
);

AdminSpecialization.associate = (models) => {
  if (models.AdminAuth) {
    AdminSpecialization.belongsTo(models.AdminAuth, {
      foreignKey: "email",
      targetKey: "email",
      as: "admin",
    });
  }
};

export default AdminSpecialization;
