export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("admin_payment_methods", {
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
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      payment_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      bank_info: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      active_flag: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.addIndex("admin_payment_methods", ["admin_id"]);
    await queryInterface.addConstraint("admin_payment_methods", {
      fields: ["admin_id", "name"],
      type: "unique",
      name: "unique_admin_payment_method",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("admin_payment_methods");
  },
};