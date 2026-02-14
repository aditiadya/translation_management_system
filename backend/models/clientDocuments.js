import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ClientDocuments = sequelize.define(
  "ClientDocuments",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    document_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_size: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    file_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "admin_details",
        key: "id",
      },
      onDelete: "SET NULL",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "client_documents",
    timestamps: true,
    createdAt: "uploaded_at",
    updatedAt: "updated_at",
  }
);

ClientDocuments.associate = (models) => {
  ClientDocuments.belongsTo(models.ClientDetails, {
    foreignKey: "client_id",
    as: "client",
    onDelete: "CASCADE",
  });

  // NEW: Add association with AdminDetails
  ClientDocuments.belongsTo(models.AdminDetails, {
    foreignKey: "uploaded_by",
    as: "uploader",
  });
};

export default ClientDocuments;
