export default (sequelize, DataTypes) => {
  return sequelize.define('PaymentMethod', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(64), allowNull: false, unique: true }
  }, { tableName: 'payment_methods', timestamps: false });
};
