import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import AdminAuth from "./adminAuth.js";

const AdminTerms = sequelize.define(
  "AdminTerms",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AdminAuth,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    terms_accepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    terms_accepted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "admin_terms",
    timestamps: false,
  }
);

AdminTerms.associate = (models) => {
  if (models.AdminAuth) {
    AdminTerms.belongsTo(models.AdminAuth, {
      foreignKey: "admin_id",
      as: "admin",
    });
  }
};

export default AdminTerms;
