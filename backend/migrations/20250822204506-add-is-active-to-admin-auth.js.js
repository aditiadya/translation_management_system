export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("admin_auth", "is_active", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: "activation_token",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("admin_auth", "is_active");
  },
};
