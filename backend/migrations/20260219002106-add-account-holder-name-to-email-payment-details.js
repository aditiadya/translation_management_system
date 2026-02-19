export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("email_payment_details", "account_holder_name", {
    type: Sequelize.STRING(255),
    allowNull: true,
    after: "email",
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("email_payment_details", "account_holder_name");
}