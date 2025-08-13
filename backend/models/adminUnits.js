export default (sequelize, DataTypes) => {
  const AdminUnits = sequelize.define(
    "AdminUnits",
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
      active_flag: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      in_use: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_word: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "admin_units",
      timestamps: false,
    }
  );

  AdminUnits.associate = (models) => {
    AdminUnits.belongsTo(models.AdminAuth, {
      foreignKey: "email",
      targetKey: "email",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return AdminUnits;
};
