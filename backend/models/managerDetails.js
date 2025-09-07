import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ManagerDetails = sequelize.define(
  "manager_details",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    client_pool: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    teams_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zoom_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    can_login: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "manager_details",
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ["admin_id"] }
    ],
  }
);

ManagerDetails.associate = (models) => {
  if (models.AdminAuth) {
    ManagerDetails.belongsTo(models.AdminAuth, {
      foreignKey: "admin_id",
      as: "admin",
      onDelete: "CASCADE",
    });
  }
};

export default ManagerDetails;