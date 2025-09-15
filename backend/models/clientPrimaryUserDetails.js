import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ClientPrimaryUserDetails = sequelize.define(
  "ClientPrimaryUserDetails",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "client_details",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timezone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    zoom_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    teams_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: true,
    },
  },
  {
    tableName: "client_primary_user_details",
    timestamps: true,
    indexes: [{ fields: ["client_id"] }],
  }
);

ClientPrimaryUserDetails.associate = (models) => {
  ClientPrimaryUserDetails.belongsTo(models.ClientDetails, {
    foreignKey: "client_id",
    as: "client",
    onDelete: "CASCADE",
  });
};

export default ClientPrimaryUserDetails;
