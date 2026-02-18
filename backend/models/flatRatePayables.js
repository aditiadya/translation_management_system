import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const FlatRatePayables = sequelize.define(
  "FlatRatePayables",
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
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_currencies",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
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
    tableName: "flat_rate_payables",
    timestamps: true,
    underscored: false,
  }
);

FlatRatePayables.associate = (models) => {
  FlatRatePayables.belongsTo(models.ProjectDetails, {
    foreignKey: "project_id",
    as: "project",
  });

  FlatRatePayables.belongsTo(models.JobDetails, {
    foreignKey: "job_id",
    as: "job",
  });

  FlatRatePayables.belongsTo(models.AdminCurrency, {
    foreignKey: "currency_id",
    as: "currency",
  });

  FlatRatePayables.belongsTo(models.JobInputFiles, {
    foreignKey: "file_id",
    as: "file",
  });
};

export default FlatRatePayables;