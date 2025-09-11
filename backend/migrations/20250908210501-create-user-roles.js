export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_roles", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      auth_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "admin_auth",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
        onDelete: "CASCADE",
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

    await queryInterface.addIndex("user_roles", ["auth_id", "role_id"], {
      unique: true,
      name: "user_roles_auth_id_role_id_unique",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user_roles");
  },
};
