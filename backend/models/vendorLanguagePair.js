import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const VendorLanguagePair = sequelize.define(
  "VendorLanguagePair",
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
    language_pair_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_language_pairs",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    price_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Cached count of price list entries for this language pair",
    },

  },
  {
    tableName: "vendor_language_pairs",
    timestamps: true,
  }
);

VendorLanguagePair.associate = (models) => {
  VendorLanguagePair.belongsTo(models.VendorDetails, {
    foreignKey: "vendor_id",
    as: "vendor",
    onDelete: "CASCADE",
  });

  VendorLanguagePair.belongsTo(models.AdminLanguagePair, {
    foreignKey: "language_pair_id",
    as: "languagePair",
    onDelete: "CASCADE",
  });
};

export default VendorLanguagePair;