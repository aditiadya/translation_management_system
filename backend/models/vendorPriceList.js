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
        model: "vendor_services",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    language_pair_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vendor_language_pairs",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    specialization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vendor_specializations",
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
  VendorPriceList.belongsTo(models.VendorDetails, {
    foreignKey: "vendor_id",
    as: "vendor",
    onDelete: "CASCADE",
  });

  VendorPriceList.belongsTo(models.VendorService, {
    foreignKey: "service_id",
    as: "service",
    onDelete: "CASCADE",
  });

  VendorPriceList.belongsTo(models.VendorLanguagePair, {
    foreignKey: "language_pair_id",
    as: "languagePair",
    onDelete: "CASCADE",
  });

  VendorPriceList.belongsTo(models.VendorSpecialization, {
      foreignKey: "specialization_id",
      as: "specialization",
      onDelete: "CASCADE",
    });

  VendorPriceList.belongsTo(models.AdminCurrency, {
    foreignKey: "currency_id",
    as: "currency",
    onDelete: "CASCADE",
  });
};

export default VendorPriceList;