import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const VendorPaymentMethod = sequelize.define(
  "VendorPaymentMethod",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vendor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "vendor_details",
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
  },
  {
    tableName: "vendor_payment_methods",
    timestamps: true,
    indexes: [
      { fields: ["vendor_id"] },
      { unique: true, fields: ["vendor_id", "payment_method"] },
    ],
  }
);

VendorPaymentMethod.associate = (models) => {
  VendorPaymentMethod.belongsTo(models.VendorDetails, {
    foreignKey: "vendor_id",
    as: "vendor",
  });

  VendorPaymentMethod.hasOne(models.VendorBankTransferDetail, {
    foreignKey: "payment_method_id",
    as: "bank_transfer_detail",
  });

  VendorPaymentMethod.hasOne(models.VendorEmailPaymentDetail, {
    foreignKey: "payment_method_id",
    as: "email_payment_detail",
  });

  VendorPaymentMethod.hasOne(models.VendorOtherPaymentDetail, {
    foreignKey: "payment_method_id",
    as: "other_payment_detail",
  });
};

export default VendorPaymentMethod;