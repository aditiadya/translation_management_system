import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const UnitBasedPayables = sequelize.define(
  "UnitBasedPayables",
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
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "job_details",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
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
      references: {
        model: "admin_currencies",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    file_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "job_input_files",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    note_for_vendor: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    internal_note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "unit_based_payables",
    timestamps: true,
    underscored: false,
  }
);

UnitBasedPayables.associate = (models) => {
  UnitBasedPayables.belongsTo(models.ProjectDetails, {
    foreignKey: "project_id",
    as: "project",
  });

  UnitBasedPayables.belongsTo(models.JobDetails, {
    foreignKey: "job_id",
    as: "job",
  });

  UnitBasedPayables.belongsTo(models.AdminUnits, {
    foreignKey: "unit_id",
    as: "unit",
  });

  UnitBasedPayables.belongsTo(models.AdminCurrency, {
    foreignKey: "currency_id",
    as: "currency",
  });

  UnitBasedPayables.belongsTo(models.JobInputFiles, {
    foreignKey: "file_id",
    as: "file",
  });
};

export default UnitBasedPayables;