import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const UserRoles = sequelize.define(
  'UserRoles',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    auth_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'admin_auth',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    tableName: 'user_roles',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['auth_id', 'role_id'] },
    ],
  }
);

UserRoles.associate = (models) => {
  if (models.AdminAuth) {
    UserRoles.belongsTo(models.AdminAuth, {
      foreignKey: 'auth_id',
      as: 'user',
      onDelete: 'CASCADE',
    });
  }

  if (models.Roles) {
    UserRoles.belongsTo(models.Roles, {
      foreignKey: 'role_id',
      as: 'role_details',
      onDelete: 'CASCADE',
    });
  }

  UserRoles.belongsTo(models.ManagerDetails, {
    foreignKey: "auth_id",
    targetKey: "auth_id",
    as: "manager",
  });
};

export default UserRoles;
