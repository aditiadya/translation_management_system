export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('admin_details', 'company_name', {
      type: Sequelize.STRING(128),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('admin_details', 'company_name', {
      type: Sequelize.STRING(128),
      allowNull: false
    });
  }
};
