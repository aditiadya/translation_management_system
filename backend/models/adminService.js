import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const AdminService = sequelize.define(
  "AdminService",
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
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    active_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "admin_services",
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

AdminService.associate = (models) => {
  if (models.AdminAuth) {
    AdminService.belongsTo(models.AdminAuth, {
      foreignKey: "admin_id",
      as: "admin",
    });
  }
  AdminService.belongsToMany(models.VendorDetails, {
    through: models.VendorService,
    foreignKey: "service_id",
    otherKey: "vendor_id",
    as: "vendors",
  });
};

export default AdminService;
