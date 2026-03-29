export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("vendor_primary_user_details", "username", {
    type: Sequelize.STRING,
    allowNull: true,
    unique: true,
    after: "vendor_id", 
  });

  await queryInterface.addColumn(
    "vendor_primary_user_details",
    "language_email",
    {
      type: Sequelize.STRING(64),
      allowNull: true,
      after: "nationality",
    }
  );

  await queryInterface.addColumn(
    "vendor_primary_user_details",
    "registered_at",
    {
      type: Sequelize.DATE,
      allowNull: true,
      after: "language_email",
    }
  );
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("vendor_primary_user_details", "username");
  await queryInterface.removeColumn("vendor_primary_user_details", "language_email");
  await queryInterface.removeColumn("vendor_primary_user_details", "registered_at");
}