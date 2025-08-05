export default (sequelize, DataTypes) => {
  return sequelize.define('Service', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(128), allowNull: false, unique: true }
  }, { tableName: 'services', timestamps: false });
};
