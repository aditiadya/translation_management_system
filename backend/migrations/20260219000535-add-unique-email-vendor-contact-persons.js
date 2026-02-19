export async function up(queryInterface, Sequelize) {
  await queryInterface.addConstraint("vendor_contact_persons", {
    fields: ["email"],
    type: "unique",
    name: "unique_vendor_contact_persons_email",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeConstraint(
    "vendor_contact_persons",
    "unique_vendor_contact_persons_email"
  );
}