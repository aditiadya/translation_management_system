export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("admin_auth", "activation_token", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("admin_auth", "activation_token");
  },
};
