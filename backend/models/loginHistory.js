import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const LoginHistory = sequelize.define(
  "LoginHistory",
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
    ip_address: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    logged_in_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "ogin_history",
    timestamps: false,
    
  }
);

LoginHistory.associate = (models) => {
  LoginHistory.belongsTo(models.AdminAuth, {
    foreignKey: "admin_id",
    as: "auth",
  });
};

export default LoginHistory;