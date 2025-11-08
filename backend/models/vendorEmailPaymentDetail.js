import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const VendorEmailPaymentDetail = sequelize.define(
  "VendorEmailPaymentDetail",
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
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "vendor_email_payment_details",
    timestamps: true,
  }
);

VendorEmailPaymentDetail.associate = (models) => {
  VendorEmailPaymentDetail.belongsTo(models.VendorPaymentMethod, {
    foreignKey: "payment_method_id",
    as: "payment_method",
  });
};

export default VendorEmailPaymentDetail;