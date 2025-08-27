export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("admin_profile", {
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
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      setup_completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    await queryInterface.addConstraint("admin_profile", {
      fields: ["admin_id"],
      type: "unique",
      name: "unique_admin_profile_per_admin",
    });

    await queryInterface.addIndex("admin_profile", ["admin_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("admin_profile");
  },
};
