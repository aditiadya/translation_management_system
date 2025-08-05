export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('specializations', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      domain_name: { type: Sequelize.STRING(50), allowNull: false },
      active_flag: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('specializations');
  }
};
