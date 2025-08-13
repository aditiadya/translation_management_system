export default (sequelize, DataTypes) => {
  const AdminCurrency = sequelize.define(
    "AdminCurrency",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      currencyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      active_flag: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "admin_currencies",
      timestamps: false,
    }
  );

  AdminCurrency.associate = (models) => {
    AdminCurrency.belongsTo(models.Currency, {
      foreignKey: "currencyId",
      as: "currency",
    });

    AdminCurrency.belongsTo(models.AdminAuth, {
      foreignKey: "email",
      targetKey: "email",
      as: "admin",
    });
  };

  return AdminCurrency;
};
