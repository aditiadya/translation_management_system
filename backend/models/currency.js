export default (sequelize, DataTypes) => {
  return sequelize.define('Currency', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING(3), allowNull: false, unique: true },
    symbol: { type: DataTypes.STRING(8), allowNull: false },
    name: { type: DataTypes.STRING(32), allowNull: false }
  }, { tableName: 'currencies', timestamps: false });
};
