export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("admin_auth", "setup_completed", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("admin_auth", "setup_completed");
  },
};
