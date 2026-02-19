export async function up(queryInterface, Sequelize) {
  await queryInterface.addConstraint("client_contact_persons", {
    fields: ["email"],
    type: "unique",
    name: "unique_client_contact_persons_email",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeConstraint(
    "client_contact_persons",
    "unique_client_contact_persons_email"
  );
}