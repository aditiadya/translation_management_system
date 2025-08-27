export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("admin_auth", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    activation_token: {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true,
    },
    is_active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    reset_token: {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: true,
    },
    token_expiry: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    refresh_token: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    refresh_token_expiry: {
      type: Sequelize.DATE,
      allowNull: true,
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

  await queryInterface.addIndex("admin_auth", ["activation_token"]);
  await queryInterface.addIndex("admin_auth", ["reset_token"]);
  await queryInterface.addIndex("admin_auth", ["refresh_token"]);
}

export async function down(queryInterface) {
  await queryInterface.dropTable("admin_auth");
}
