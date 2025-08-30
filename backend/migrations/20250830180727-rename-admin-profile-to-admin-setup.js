export async function up(queryInterface, Sequelize) {
  await queryInterface.renameTable("admin_profile", "admin_setup");
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.renameTable("admin_setup", "admin_profile");
}
