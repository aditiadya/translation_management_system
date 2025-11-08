import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const VendorOtherPaymentDetail = sequelize.define(
  "VendorOtherPaymentDetail",
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
        model: "vendor_payment_methods",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    payment_method_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    tableName: "vendor_other_payment_details",
    timestamps: true,
  }
);

VendorOtherPaymentDetail.associate = (models) => {
  VendorOtherPaymentDetail.belongsTo(models.VendorPaymentMethod, {
    foreignKey: "payment_method_id",
    as: "payment_method",
  });
};

export default VendorOtherPaymentDetail;