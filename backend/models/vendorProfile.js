import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const VendorProfile = sequelize.define(
  "VendorProfile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: true,
    },
    teams_id: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    zoom_id: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    language_email: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
  },
  {
    tableName: "vendor_profile",
    timestamps: true,
  }
);

VendorProfile.associate = (models) => {
  if (models.VendorDetails) {
    VendorProfile.belongsTo(models.VendorDetails, {
      foreignKey: "vendor_id",
      as: "vendor",
      onDelete: "CASCADE",
    });
  }
};

export default VendorProfile;
