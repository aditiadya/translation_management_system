export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("email_payment_details", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    payment_method_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "admin_payment_methods",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("email_payment_details");
}
