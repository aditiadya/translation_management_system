export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("admin_payment_methods", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      payment_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      bank_info: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("admin_payment_methods");
  },
};
