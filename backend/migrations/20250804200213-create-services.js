export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('services', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(128), allowNull: false, unique: true }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('services');
  }
};
