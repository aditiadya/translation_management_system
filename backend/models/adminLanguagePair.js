export default (sequelize, DataTypes) => {
  const AdminLanguagePair = sequelize.define('AdminLanguagePair', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { 
      type: DataTypes.STRING(255), 
      allowNull: false 
    },
    source_language_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    target_language_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    active_flag: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, { 
    tableName: 'admin_language_pairs', 
    timestamps: false 
  });

  return AdminLanguagePair;
};
