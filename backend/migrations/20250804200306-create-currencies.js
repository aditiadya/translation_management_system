export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('currencies', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      code: { type: Sequelize.STRING(3), allowNull: false, unique: true },
      symbol: { type: Sequelize.STRING(8), allowNull: false },
      name: { type: Sequelize.STRING(32), allowNull: false }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('currencies');
  }
};
