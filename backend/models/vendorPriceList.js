import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const VendorPriceList = sequelize.define(
  "VendorPriceList",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
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
        model: "admin_services", // CHANGED: vendor_services → admin_services
        key: "id",
      },
      onDelete: "CASCADE",
    },
    language_pair_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_language_pairs", // CHANGED: vendor_language_pairs → admin_language_pairs
        key: "id",
      },
      onDelete: "CASCADE",
    },
    specialization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_specializations", // CHANGED: vendor_specializations → admin_specializations
        key: "id",
      },
      onDelete: "CASCADE",
    },
    unit: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price_per_unit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_currencies",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "vendor_price_list",
    timestamps: true,
  }
);

VendorPriceList.associate = (models) => {
  // Vendor relationship (unchanged)
  VendorPriceList.belongsTo(models.VendorDetails, {
    foreignKey: "vendor_id",
    as: "vendor",
    onDelete: "CASCADE",
  });

  // Service relationship - CHANGED to AdminService
  VendorPriceList.belongsTo(models.AdminService, {
    foreignKey: "service_id",
    as: "service",
    onDelete: "CASCADE",
  });

  // Language Pair relationship - CHANGED to AdminLanguagePair
  VendorPriceList.belongsTo(models.AdminLanguagePair, {
    foreignKey: "language_pair_id",
    as: "languagePair",
    onDelete: "CASCADE",
  });

  // Specialization relationship - CHANGED to AdminSpecialization
  VendorPriceList.belongsTo(models.AdminSpecialization, {
    foreignKey: "specialization_id",
    as: "specialization",
    onDelete: "CASCADE",
  });

  // Currency relationship (unchanged)
  VendorPriceList.belongsTo(models.AdminCurrency, {
    foreignKey: "currency_id",
    as: "currency",
    onDelete: "CASCADE",
  });
};

export default VendorPriceList;
