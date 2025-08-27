import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

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
        model: "admin_auth",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    terms_accepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "admin_terms",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["admin_id"],
      },
    ],
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
