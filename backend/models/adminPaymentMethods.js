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
    payment_method: {
      type: DataTypes.ENUM("bank_transfer", "paypal", "payoneer", "skrill", "other"),
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    active_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "admin_payment_methods",
    timestamps: true,
    indexes: [
      { fields: ["admin_id"] },
      { unique: true, fields: ["admin_id", "payment_method"] },
    ],
  }
);

AdminPaymentMethod.associate = (models) => {
  AdminPaymentMethod.belongsTo(models.AdminAuth, {
    foreignKey: "admin_id",
    as: "admin",
  });

  AdminPaymentMethod.hasOne(models.BankTransferDetail, {
    foreignKey: "payment_method_id",
    as: "bank_transfer_detail",
  });

  AdminPaymentMethod.hasOne(models.EmailPaymentDetail, {
    foreignKey: "payment_method_id",
    as: "email_payment_detail",
  });

  AdminPaymentMethod.hasOne(models.OtherPaymentDetail, {
    foreignKey: "payment_method_id",
    as: "other_payment_detail",
  });
};

export default AdminPaymentMethod;