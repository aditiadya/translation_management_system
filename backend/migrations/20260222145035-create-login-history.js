export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("login_history", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    admin_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "admin_auth",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    ip_address: {
      type: Sequelize.STRING(45),
      allowNull: true,
    },
    user_agent: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    logged_in_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("login_history");
}