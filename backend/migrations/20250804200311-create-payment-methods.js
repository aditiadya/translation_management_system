export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payment_methods', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(64), allowNull: false, unique: true }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('payment_methods');
  }
};
