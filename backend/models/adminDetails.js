import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const AdminDetails = sequelize.define('AdminDetails', {
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
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING(32),
    allowNull: true,
    validate: {
      is: /^\+?[0-9\-]{7,15}$/i
    }
  }
}, {
  tableName: 'admin_details',
  timestamps: true, 
  indexes: [
      {
        fields: ["admin_id"], 
      },
    ],
});

AdminDetails.associate = (models) => {
  if (models.AdminAuth) {
    AdminDetails.belongsTo(models.AdminAuth, {
      foreignKey: "admin_id",
      as: "auth",
      onDelete: "CASCADE",
    });
  }
};

export default AdminDetails;
