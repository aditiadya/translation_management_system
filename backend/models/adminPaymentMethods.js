export default (sequelize, DataTypes) => {
  const AdminPaymentMethod = sequelize.define(
    "AdminPaymentMethod",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      payment_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      bank_info: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "admin_payment_methods",
      timestamps: false,
    }
  );

  return AdminPaymentMethod;
};
