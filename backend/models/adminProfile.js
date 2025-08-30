import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const AdminProfile = sequelize.define('AdminProfile', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  admin_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'admin_auth',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true,
  },
  teams_id: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  zoom_id: {
    type: DataTypes.STRING(128),
    allowNull: true,
  },
  language_email: {
    type: DataTypes.STRING(64),
    allowNull: true,
  }
}, {
  tableName: 'admin_profile',
  timestamps: true,
  indexes: [
    {
      fields: ["admin_id"],
    },
  ],
});

AdminProfile.associate = (models) => {
  if (models.AdminAuth) {
    AdminProfile.belongsTo(models.AdminAuth, {
      foreignKey: "admin_id",
      as: "auth",
      onDelete: "CASCADE",
    });
  }
};

export default AdminProfile;