import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const AdminProfileImage = sequelize.define(
  "AdminProfileImage",
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
    file_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    file_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "admin_profile_images",
    timestamps: true,
    createdAt: "uploaded_at",
    updatedAt: "updated_at",
  },
);

AdminProfileImage.associate = (models) => {
  if (models.AdminAuth) {
    AdminProfileImage.belongsTo(models.AdminAuth, {
      foreignKey: "admin_id",
      as: "auth",
      onDelete: "CASCADE",
    });
  }
};

export default AdminProfileImage;