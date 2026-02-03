import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const UnitBasedReceivables = sequelize.define(
  "UnitBasedReceivables",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "project_details",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    po_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    language_pair_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    unit_amount: {
      type: DataTypes.DECIMAL(12, 3),
      allowNull: false,
    },

    unit_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_units",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },

    price_per_unit: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },

    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    file_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "project_input_file",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },

    internal_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "unit_based_receivables",
    timestamps: true,
    underscored: true,
  }
);

export default UnitBasedReceivables;