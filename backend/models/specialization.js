export default (sequelize, DataTypes) => {
  return sequelize.define('Specialization', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    domain_name: { type: DataTypes.STRING(50), allowNull: false },
    active_flag: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  }, { tableName: 'specializations', timestamps: false });
};
