import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const AdminUnits = sequelize.define(
  "AdminUnits",
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
    active_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    in_use: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_word: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "admin_units",
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

AdminUnits.associate = (models) => {
  if (models.AdminAuth) {
    AdminUnits.belongsTo(models.AdminAuth, {
      foreignKey: "admin_id",
      as: "admin",
    });
  }
};

export default AdminUnits;
