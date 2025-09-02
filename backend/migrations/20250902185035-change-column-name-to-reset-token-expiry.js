export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("admin_auth", "token_expiry", "reset_token_expiry");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn("admin_auth", "reset_token_expiry", "token_expiry");
  },
};
