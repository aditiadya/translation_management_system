export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('admin_details', 'username', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('admin_details', 'username', {
      type: Sequelize.STRING(255),
      allowNull: false, 
    });
  },
};
