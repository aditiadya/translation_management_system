export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("admin_language_pairs", {
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
      source_language_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "languages",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      target_language_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "languages",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      active_flag: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.addIndex("admin_language_pairs", ["admin_id"]);
    await queryInterface.addIndex("admin_language_pairs", ["source_language_id"]);
    await queryInterface.addIndex("admin_language_pairs", ["target_language_id"]);
    await queryInterface.addConstraint("admin_language_pairs", {
      fields: ["admin_id", "source_language_id", "target_language_id"],
      type: "unique",
      name: "unique_admin_language_pair",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("admin_language_pairs");
  },
};