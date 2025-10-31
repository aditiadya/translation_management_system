export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("vendor_specializations", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    vendor_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "vendor_details",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    specialization_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "admin_specializations",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });

}

export async function down(queryInterface) {
  await queryInterface.dropTable("vendor_specializations");
}
