import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const VendorSpecialization = sequelize.define(
  "VendorSpecialization",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vendor_details",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    specialization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_specializations",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "vendor_specializations",
    timestamps: true,
  }
);

VendorSpecialization.associate = (models) => {
  if (models.VendorDetails) {
    VendorSpecialization.belongsTo(models.VendorDetails, {
      foreignKey: "vendor_id",
      as: "vendor",
      onDelete: "CASCADE",
    });
  }
  if (models.AdminSpecialization) {
    VendorSpecialization.belongsTo(models.AdminSpecialization, {
      foreignKey: "specialization_id",
      as: "specialization",
      onDelete: "CASCADE",
    });
  }
};

export default VendorSpecialization;