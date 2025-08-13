export default (sequelize, DataTypes) => {
  const Currency = sequelize.define(
    "Currency",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(25),
        allowNull: false,
        unique: true,
      },
      symbol: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      tableName: "currencies",
      timestamps: true,
    }
  );

  Currency.associate = (models) => {
    Currency.hasMany(models.AdminCurrency, {
      foreignKey: "currencyId",
      as: "adminCurrencies",
    });
  };

  return Currency;
};
