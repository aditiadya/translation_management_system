import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ClientContactPersons = sequelize.define(
  "ClientContactPersons",
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
      allowNull: true,
    },
    email: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,     
  validate: {
    isEmail: true,
  },
},
    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
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
    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_invoicing: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "client_contact_persons",
    timestamps: true,
    indexes: [{ fields: ["client_id"] }],
  }
);

ClientContactPersons.associate = (models) => {
  ClientContactPersons.belongsTo(models.ClientDetails, {
    foreignKey: "client_id",
    as: "client",
    onDelete: "CASCADE",
  });
};

export default ClientContactPersons;
