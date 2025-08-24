export async function up(queryInterface, Sequelize) {
  await queryInterface.addConstraint("admin_details", {
    fields: ["username"],
    type: "unique",
    name: "unique_username_constraint"
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeConstraint("admin_details", "unique_username_constraint");
}
