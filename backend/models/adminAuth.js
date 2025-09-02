import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const AdminAuth = sequelize.define(
  "AdminAuth",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    activation_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    reset_token_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    refresh_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    refresh_token_expiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "admin_auth",
    timestamps: true,
    indexes: [
      { fields: ["activation_token"] },
      { fields: ["reset_token"] },
      { fields: ["refresh_token"] },
    ],
  }
);


AdminAuth.associate = (models) => {
  if (models.AdminSetup) {
    AdminAuth.hasOne(models.AdminSetup, {
      foreignKey: "admin_id",
      as: "setup",
      onDelete: "CASCADE",
    });
  }

  if (models.AdminTerms) {
    AdminAuth.hasOne(models.AdminTerms, {
      foreignKey: "admin_id",
      as: "terms",
      onDelete: "CASCADE",
    });
  }

  if (models.AdminDetails) {
    AdminAuth.hasOne(models.AdminDetails, {
      foreignKey: "admin_id",
      as: "details",
      onDelete: "CASCADE",
    });
  }

  if(models.AdminCurrency){
    AdminAuth.hasMany(models.AdminCurrency, { 
      foreignKey: "admin_id", 
      as: "currencies",
      onDelete: "CASCADE",
    });
  }
  
  if (models.AdminService) {
    AdminAuth.hasMany(models.AdminService, {
      foreignKey: "admin_id",
      as: "services",
      onDelete: "CASCADE",
    });
  }

  if (models.AdminSpecialization) {
    AdminAuth.hasMany(models.AdminSpecialization, {
      foreignKey: "admin_id",
      as: "specializations",
      onDelete: "CASCADE",
    });
  }

  if (models.AdminUnits) {
    AdminAuth.hasMany(models.AdminUnits, {
      foreignKey: "admin_id",
      as: "units",
      onDelete: "CASCADE",
    });
  }

  if (models.AdminPaymentMethod) {
    AdminAuth.hasMany(models.AdminPaymentMethod, {
      foreignKey: "admin_id",
      as: "payments",
      onDelete: "CASCADE",
    });
  }

  if (models.AdminLanguagePair) {
    AdminAuth.hasMany(models.AdminLanguagePair, {
      foreignKey: "admin_id",
      as: "languagePairs",
      onDelete: "CASCADE",
    });
  }
};

export default AdminAuth;
