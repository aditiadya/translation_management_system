import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const AdminPaymentMethod = sequelize.define(
  "AdminPaymentMethod",
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    payment_type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    bank_info: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    active_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "admin_payment_methods",
    timestamps: true,
    indexes: [
      {
        fields: ["admin_id"],
      },
      {
        unique: true,
        fields: ["admin_id", "name"],
      },
    ],
  }
);

AdminPaymentMethod.associate = (models) => {
  if (models.AdminAuth) {
    AdminPaymentMethod.belongsTo(models.AdminAuth, {
      foreignKey: "admin_id",
      as: "admin",
    });
  }
};

export default AdminPaymentMethod;
