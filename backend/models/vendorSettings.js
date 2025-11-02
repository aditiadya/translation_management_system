import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const VendorSettings = sequelize.define(
  "VendorSettings",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "vendor_details", key: "id" },
      onDelete: "CASCADE",
    },
    works_with_all_services: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    works_with_all_language_pairs: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    works_with_all_specializations: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "vendor_settings",
    timestamps: true,
  }
);

export default VendorSettings;