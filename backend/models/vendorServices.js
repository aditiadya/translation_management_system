import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const VendorService = sequelize.define(
  "VendorService",
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
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_services",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "vendor_services",
    timestamps: true,
  }
);

VendorService.associate = (models) => {
  VendorService.belongsTo(models.VendorDetails, {
    foreignKey: "vendor_id",
    as: "vendor",
    onDelete: "CASCADE",
  });

  VendorService.belongsTo(models.AdminService, {
    foreignKey: "service_id",
    as: "service",
    onDelete: "CASCADE",
  });
};

export default VendorService;