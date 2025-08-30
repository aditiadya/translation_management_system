import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const AdminSetup = sequelize.define(
  "AdminSetup",
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
    setup_completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "admin_setup",
    timestamps: true,
    indexes: [
      {
        fields: ["admin_id"],
        unique: true,
      },
    ],
  }
);

AdminSetup.associate = (models) => {
  if (models.AdminAuth) {
    AdminSetup.belongsTo(models.AdminAuth, {
      foreignKey: "admin_id",
      as: "admin",
    });
  }
};

export default AdminSetup;
