export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("admin_currencies", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "admin_auth",
          key: "email",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      currencyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "currencies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      active_flag: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("admin_currencies");
  },
};
