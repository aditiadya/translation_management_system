export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("other_payment_details", {
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
    payment_method_name: {
      type: Sequelize.STRING(100),
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
  await queryInterface.dropTable("other_payment_details");
}