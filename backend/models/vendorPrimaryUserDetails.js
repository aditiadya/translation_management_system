import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const VendorPrimaryUserDetails = sequelize.define(
  "VendorPrimaryUserDetails",
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
        model: "client_details",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zoom_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    teams_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: true,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "vendor_primary_user_details",
    timestamps: true,
    indexes: [{ fields: ["vendor_id"] }],
  }
);

VendorPrimaryUserDetails.associate = (models) => {
  VendorPrimaryUserDetails.belongsTo(models.VendorDetails, {
    foreignKey: "vendor_id",
    as: "vendor",
    onDelete: "CASCADE",
  });
};

export default VendorPrimaryUserDetails;