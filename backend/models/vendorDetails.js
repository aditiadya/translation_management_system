import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const VendorDetails = sequelize.define(
  "VendorDetails",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    auth_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_auth",
        key: "id",
      },
      onDelete: "CASCADE",
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
    type: {
      type: DataTypes.ENUM("Company", "Freelance", "In-House"),
      allowNull: false,
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    legal_entity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state_region: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pan_tax_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gstin_vat_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    can_login: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    assignable_to_jobs: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    finances_visible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "vendor_details",
    timestamps: true,
  }
);

VendorDetails.associate = (models) => {
  VendorDetails.belongsTo(models.AdminAuth, {
    foreignKey: "admin_id",
    as: "admin",
    onDelete: "CASCADE",
  });

  VendorDetails.belongsTo(models.AdminAuth, {
    foreignKey: "auth_id",
    as: "auth",
    onDelete: "CASCADE",
  });

  VendorDetails.hasOne(models.VendorPrimaryUserDetails, {
    foreignKey: "vendor_id",
    as: "primary_users",
    onDelete: "CASCADE",
  });
};

export default VendorDetails;