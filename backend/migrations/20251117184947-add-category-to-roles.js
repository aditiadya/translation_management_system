export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("roles", "category", {
    type: Sequelize.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("roles", "category");
}
