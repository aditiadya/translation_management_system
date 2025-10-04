import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const BankTransferDetail = sequelize.define(
  "BankTransferDetail",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    payment_method_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "admin_payment_methods",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    payment_method_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    beneficiary_name: { type: DataTypes.STRING(100), allowNull: true },
    beneficiary_address: { type: DataTypes.TEXT, allowNull: true },
    bank_name: { type: DataTypes.STRING(100), allowNull: false },
    account_number: { type: DataTypes.STRING(100), allowNull: true },
    ifsc_code: { type: DataTypes.STRING(50), allowNull: true },
    swift: { type: DataTypes.STRING(50), allowNull: true },
    iban: { type: DataTypes.STRING(100), allowNull: true },
    sort_code: { type: DataTypes.STRING(50), allowNull: true },
    bank_address: { type: DataTypes.TEXT, allowNull: true },
    country: { type: DataTypes.STRING(100), allowNull: false },
    state_region: { type: DataTypes.STRING(100), allowNull: true },
    city: { type: DataTypes.STRING(100), allowNull: true },
    postal_code: { type: DataTypes.STRING(50), allowNull: true },
  },
  {
    tableName: "bank_transfer_details",
    timestamps: true,
  }
);

BankTransferDetail.associate = (models) => {
  BankTransferDetail.belongsTo(models.AdminPaymentMethod, {
    foreignKey: "payment_method_id",
    as: "payment_method",
  });
};

export default BankTransferDetail;