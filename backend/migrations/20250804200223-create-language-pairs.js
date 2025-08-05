export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('language_pairs', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      source_language: { type: Sequelize.STRING(10), allowNull: false },
      target_language: { type: Sequelize.STRING(10), allowNull: false }
    });
    await queryInterface.addConstraint('language_pairs', {
      fields: ['source_language', 'target_language'],
      type: 'unique',
      name: 'unique_source_target_language'
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('language_pairs');
  }
};
