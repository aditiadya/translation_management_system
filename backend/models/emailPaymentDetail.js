import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const EmailPaymentDetail = sequelize.define(
  "EmailPaymentDetail",
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
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    account_holder_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "email_payment_details",
    timestamps: true,
  }
);

EmailPaymentDetail.associate = (models) => {
  EmailPaymentDetail.belongsTo(models.AdminPaymentMethod, {
    foreignKey: "payment_method_id",
    as: "payment_method",
  });
};

export default EmailPaymentDetail;