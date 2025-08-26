import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const AdminCurrency = sequelize.define(
  "AdminCurrency",
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
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "currencies",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    active_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "admin_currencies",
    timestamps: true,
    indexes: [
      { fields: ["admin_id"] },
      { fields: ["currency_id"] },
      {
        unique: true,
        fields: ["admin_id", "currency_id"],
      },
    ],
  }
);

AdminCurrency.associate = (models) => {
  if (models.Currency) {
    AdminCurrency.belongsTo(models.Currency, {
      foreignKey: "currency_id",
      as: "currency",
    });
  }
  if (models.AdminAuth) {
    AdminCurrency.belongsTo(models.AdminAuth, {
      foreignKey: "admin_id",
      as: "admin",
    });
  }
};

export default AdminCurrency;
