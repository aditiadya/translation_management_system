import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const VendorProfileImage = sequelize.define(
  "VendorProfileImage",
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
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    file_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "vendor_profile_images",
    timestamps: true,
    createdAt: "uploaded_at",
    updatedAt: "updated_at",
  }
);

VendorProfileImage.associate = (models) => {
  if (models.VendorDetails) {
    VendorProfileImage.belongsTo(models.VendorDetails, {
      foreignKey: "vendor_id",
      as: "vendor",
      onDelete: "CASCADE",
    });
  }
};

export default VendorProfileImage;
