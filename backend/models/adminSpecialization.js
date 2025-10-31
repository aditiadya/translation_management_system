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
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_auth",
        key: "id",
      },
      onDelete: "CASCADE",
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
    timestamps: true,
    indexes: [
      {
        fields: ["admin_id"],
      },
      {
        unique: true,
        fields: ["admin_id", "name"],
      },
    ],
  }
);

AdminSpecialization.associate = (models) => {
  if (models.AdminAuth) {
    AdminSpecialization.belongsTo(models.AdminAuth, {
      foreignKey: "admin_id",
      as: "admin",
    });
  }

  AdminSpecialization.belongsToMany(models.VendorSpecialization, {
    through: models.VendorSpecialization,
    foreignKey: "specialization_id",
    otherKey: "vendor_id",
    as: "vendors",
  });
};

export default AdminSpecialization;