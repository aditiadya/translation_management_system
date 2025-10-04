import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const OtherPaymentDetail = sequelize.define(
  "OtherPaymentDetail",
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
  },
  {
    tableName: "other_payment_details",
    timestamps: true,
  }
);

OtherPaymentDetail.associate = (models) => {
  OtherPaymentDetail.belongsTo(models.AdminPaymentMethod, {
    foreignKey: "payment_method_id",
    as: "payment_method",
  });
};

export default OtherPaymentDetail;