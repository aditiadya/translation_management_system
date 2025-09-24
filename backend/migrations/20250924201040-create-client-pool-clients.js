export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("client_pool_clients", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    client_pool_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "client_pools", key: "id" },
      onDelete: "CASCADE",
    },
    client_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "client_details", key: "id" },
      onDelete: "CASCADE",
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("client_pool_clients");
}