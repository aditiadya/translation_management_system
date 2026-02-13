export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("admin_services", {
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
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
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

    await queryInterface.addIndex("admin_services", ["admin_id"]);
    await queryInterface.addConstraint("admin_services", {
      fields: ["admin_id", "name"],
      type: "unique",
      name: "unique_admin_service",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("admin_services");
  },
};