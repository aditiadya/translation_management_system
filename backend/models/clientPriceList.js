import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ClientPriceList = sequelize.define(
  "ClientPriceList",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "client_details",
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
    language_pair_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_language_pairs",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    specialization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_specializations",
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
    tableName: "client_price_list",
    timestamps: true,
  }
);

ClientPriceList.associate = (models) => {
  ClientPriceList.belongsTo(models.ClientDetails, {
    foreignKey: "client_id",
    as: "client",
    onDelete: "CASCADE",
  });

  ClientPriceList.belongsTo(models.AdminService, {
    foreignKey: "service_id",
    as: "service",
    onDelete: "CASCADE",
  });

  ClientPriceList.belongsTo(models.AdminLanguagePair, {
    foreignKey: "language_pair_id",
    as: "languagePair",
    onDelete: "CASCADE",
  });

  ClientPriceList.belongsTo(models.AdminSpecialization, {
      foreignKey: "specialization_id",
      as: "specialization",
      onDelete: "CASCADE",
    });

  ClientPriceList.belongsTo(models.AdminCurrency, {
    foreignKey: "currency_id",
    as: "currency",
    onDelete: "CASCADE",
  });
};

export default ClientPriceList;