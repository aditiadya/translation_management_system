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
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    currencyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    active_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "admin_currencies",
    timestamps: false,
  }
);

AdminCurrency.associate = (models) => {
  if (models.Currency) {
    AdminCurrency.belongsTo(models.Currency, {
      foreignKey: "currencyId",
      as: "currency",
    });
  }
  if (models.AdminAuth) {
    AdminCurrency.belongsTo(models.AdminAuth, {
      foreignKey: "email",
      targetKey: "email",
      as: "admin",
    });
  }
};

export default AdminCurrency;
