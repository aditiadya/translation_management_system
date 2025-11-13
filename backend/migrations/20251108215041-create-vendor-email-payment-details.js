export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("vendor_email_payment_details", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    payment_method_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "vendor_payment_methods",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("vendor_email_payment_details");
}