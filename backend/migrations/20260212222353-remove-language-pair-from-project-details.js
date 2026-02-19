export async function up(queryInterface, Sequelize) {
  // Remove the old language_pair_id column
  await queryInterface.removeColumn("project_details", "language_pair_id");
  

  console.log("✓ Removed language_pair_id column from project_details");
}

export async function down(queryInterface, Sequelize) {
  // Add the column back in case of rollback
  await queryInterface.addColumn("project_details", "language_pair_id", {
    type: Sequelize.INTEGER,
    allowNull: true,
    references: {
      model: "admin_language_pairs",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });
}