import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const AdminDetails = sequelize.define('AdminDetails', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    references: {
      model: 'admin_auth',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  account_type: {
    type: DataTypes.ENUM('enterprise', 'freelance'),
    allowNull: false
  },
  company_name: {
    type: DataTypes.STRING(128),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  time_zone: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(64),
    allowNull: false
  },
  username: {
    type: DataTypes.STRING(64),
    allowNull: true,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING(32),
    allowNull: false
  }
}, {
  tableName: 'admin_details',
  timestamps: false
});

AdminDetails.associate = (models) => {
  if (models.AdminAuth) {
    AdminDetails.belongsTo(models.AdminAuth, {
      foreignKey: "id",
      as: "auth",
    });
  }
};

export default AdminDetails;